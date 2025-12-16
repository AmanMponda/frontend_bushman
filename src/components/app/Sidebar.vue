<script setup lang="ts">
import { useAppSidebarMenuStore } from '@/stores/app-sidebar-menu'
import { useAppOptionStore } from '@/stores/app-option'
import { onMounted } from 'vue'
import { slideToggle } from '@/composables/slideToggle.js'
import { slideUp } from '@/composables/slideUp.js'
import SidebarNav from '@/components/app/SidebarNav.vue'

const appSidebarMenuStore = useAppSidebarMenuStore()
const appOption = useAppOptionStore()
// Access the store value - setup stores return the value directly when used as a function
const appSidebarMenu = appSidebarMenuStore
let appSidebarFloatSubmenuTimeout: ReturnType<typeof setTimeout> | null = null
let appSidebarFloatSubmenuDom: HTMLElement | string = ''

function appSidebarMobileToggled() {
  appOption.appSidebarMobileToggled = !appOption.appSidebarMobileToggled
}

function handleSidebarMinifyFloatMenuClick() {
  const elms = [].slice.call(
    document.querySelectorAll('.app-float-submenu .menu-item.has-sub > .menu-link'),
  ) as HTMLElement[]
  if (elms) {
    elms.map(function (elm: HTMLElement) {
      elm.addEventListener('click', function (e: Event) {
        e.preventDefault()
        const elm = e.currentTarget as HTMLElement
        const targetItem = elm.closest('.menu-item') as HTMLElement | null
        if (!targetItem) return
        const target = targetItem.querySelector('.menu-submenu') as HTMLElement | null
        if (!target) return
        const targetStyle = getComputedStyle(target)
        const close = targetStyle.getPropertyValue('display') != 'none' ? true : false
        const expand = targetStyle.getPropertyValue('display') != 'none' ? false : true

        slideToggle(target)

        const loopHeight = setInterval(function () {
          const targetMenu = document.querySelector('.app-float-submenu') as HTMLElement | null
          if (!targetMenu) return
          const targetHeight = targetMenu.clientHeight
          const targetOffset = targetMenu.getBoundingClientRect()
          const targetOriTopStr = targetMenu.getAttribute('data-offset-top')
          const targetOriTop = targetOriTopStr ? parseInt(targetOriTopStr, 10) : 0
          let targetTop = targetOffset.top
          const windowHeight = document.body.clientHeight
          if (close) {
            if (targetTop > targetOriTop) {
              targetTop = targetTop > targetOriTop ? targetOriTop : targetTop
              targetMenu.style.top = targetTop + 'px'
              targetMenu.style.bottom = 'auto'
            }
          }
          if (expand) {
            if (windowHeight - targetTop < targetHeight) {
              targetMenu.style.top = 'auto'
              targetMenu.style.bottom = '0'
            }
            const floatSubmenuElm = document.querySelector('.app-float-submenu') as HTMLElement | null
            if (targetHeight > windowHeight) {
              if (floatSubmenuElm) {
                const splitClass = 'overflow-scroll mh-100vh'.split(' ')
                for (let i = 0; i < splitClass.length; i++) {
                  floatSubmenuElm.classList.add(splitClass[i])
                }
              }
            }
          }
        }, 1)
        setTimeout(function () {
          clearInterval(loopHeight)
        }, 250)
      } as any)
    })
  }
}

function handleSidebarMinifyFloatMenu() {
  const elms = [].slice.call(
    document.querySelectorAll('.app-sidebar .menu > .menu-item.has-sub > .menu-link'),
  ) as HTMLElement[]
  if (elms) {
    elms.map(function (elm: HTMLElement) {
      elm.addEventListener('mouseenter', function (this: HTMLElement) {
        const appElm = document.querySelector('.app')
        if (appElm && appElm.classList.contains('app-sidebar-minified')) {
          if (appSidebarFloatSubmenuTimeout) {
            clearTimeout(appSidebarFloatSubmenuTimeout)
          }
          const menuItem = (this as HTMLElement).closest('.menu-item') as HTMLElement | null
          if (!menuItem) return
          const targetMenu = menuItem.querySelector('.menu-submenu') as HTMLElement | null
          if (!targetMenu) return
          const currentElm = this as HTMLElement
          const existingFloatSubmenu = document.querySelector('.app-float-submenu')
          if (
            typeof appSidebarFloatSubmenuDom === 'object' &&
            appSidebarFloatSubmenuDom === currentElm &&
            existingFloatSubmenu
          ) {
            return
          } else {
            appSidebarFloatSubmenuDom = currentElm
          }
          const targetMenuHtml = targetMenu.innerHTML
          if (targetMenuHtml) {
            const bodyStyle = getComputedStyle(document.body)
            const sidebarEl = document.querySelector('.app-sidebar') as HTMLElement | null
            if (!sidebarEl) return
            const sidebarOffset = sidebarEl.getBoundingClientRect()
            const sidebarWidth = sidebarEl.clientWidth
            const sidebarX =
              bodyStyle.getPropertyValue('direction') != 'rtl'
                ? sidebarOffset.left + sidebarWidth
                : document.body.clientWidth - sidebarOffset.left
            const targetHeight = handleGetHiddenMenuHeight(targetMenu)
            const targetOffset = this.getBoundingClientRect()
            const targetTop = targetOffset.top
            const targetLeft = bodyStyle.getPropertyValue('direction') != 'rtl' ? sidebarX : 'auto'
            const targetRight = bodyStyle.getPropertyValue('direction') != 'rtl' ? 'auto' : sidebarX
            const windowHeight = document.body.clientHeight

            if (!document.querySelector('.app-float-submenu')) {
              let overflowClass = ''
              if (targetHeight > windowHeight) {
                overflowClass = 'overflow-scroll mh-100vh'
              }
              const html = document.createElement('div')
              html.setAttribute('id', 'app-float-submenu')
              html.setAttribute('class', 'app-float-submenu ' + overflowClass)
              html.setAttribute('data-offset-top', String(targetTop))
              html.setAttribute('data-menu-offset-top', String(targetTop))
              html.innerHTML = targetMenuHtml
              appElm.appendChild(html)

              const elm = document.getElementById('app-float-submenu')
              if (elm) {
                elm.addEventListener('mouseover', function () {
                  if (appSidebarFloatSubmenuTimeout) {
                    clearTimeout(appSidebarFloatSubmenuTimeout)
                  }
                })
                elm.addEventListener('mouseout', function () {
                  appSidebarFloatSubmenuTimeout = setTimeout(() => {
                    const floatSubmenu = document.querySelector('.app-float-submenu')
                    if (floatSubmenu) {
                      floatSubmenu.remove()
                    }
                  }, 250)
                })
              }
            } else {
              const floatSubmenu = document.querySelector('.app-float-submenu') as HTMLElement | null
              const floatSubmenuElm = document.querySelector('.app-float-submenu') as HTMLElement | null

              if (targetHeight > windowHeight) {
                if (floatSubmenuElm) {
                  const splitClass = 'overflow-scroll mh-100vh'.split(' ')
                  for (let i = 0; i < splitClass.length; i++) {
                    floatSubmenuElm.classList.add(splitClass[i])
                  }
                }
              }
              if (floatSubmenu) {
                floatSubmenu.setAttribute('data-offset-top', String(targetTop))
                floatSubmenu.setAttribute('data-menu-offset-top', String(targetTop))
              }
              if (floatSubmenuElm) {
                floatSubmenuElm.innerHTML = targetMenuHtml
              }
            }

            const floatSubmenuElm2 = document.querySelector('.app-float-submenu') as HTMLElement | null
            const targetHeight2 = floatSubmenuElm2?.clientHeight || 0
            if (windowHeight - targetTop > targetHeight2) {
              if (floatSubmenuElm2) {
                floatSubmenuElm2.style.top = targetTop + 'px'
                floatSubmenuElm2.style.left = String(targetLeft) + 'px'
                floatSubmenuElm2.style.bottom = 'auto'
                floatSubmenuElm2.style.right = String(targetRight) + 'px'
              }
            } else {
              if (floatSubmenuElm2) {
                floatSubmenuElm2.style.top = 'auto'
                floatSubmenuElm2.style.left = String(targetLeft) + 'px'
                floatSubmenuElm2.style.bottom = '0'
                floatSubmenuElm2.style.right = String(targetRight) + 'px'
              }
            }
            handleSidebarMinifyFloatMenuClick()
          } else {
            appSidebarFloatSubmenuDom = ''
            const floatSubmenu = document.querySelector('.app-float-submenu')
            if (floatSubmenu) {
              floatSubmenu.remove()
            }
          }
        }
      } as any)
      elm.addEventListener('mouseleave', function () {
        const appElm = document.querySelector('.app')
        if (appElm && appElm.classList.contains('app-sidebar-minified')) {
          appSidebarFloatSubmenuTimeout = setTimeout(() => {
            appSidebarFloatSubmenuDom = ''
            const floatSubmenu = document.querySelector('.app-float-submenu')
            if (floatSubmenu) {
              floatSubmenu.remove()
            }
          }, 250)
        }
      } as any)
    })
  }
}

function handleGetHiddenMenuHeight(elm: HTMLElement): number {
  elm.setAttribute('style', 'position: absolute; visibility: hidden; display: block !important')
  const targetHeight = elm.clientHeight
  elm.removeAttribute('style')
  return targetHeight
}

onMounted(() => {
  const handleSidebarMenuToggle = function (menus: HTMLElement[], expandTime: number = 250) {
    menus.map(function (menu: HTMLElement) {
      menu.addEventListener('click', function (e: Event) {
        e.preventDefault()
        const target = (this as HTMLElement).nextElementSibling as HTMLElement | null
        if (!target) return

        menus.map(function (m: HTMLElement) {
          const otherTarget = m.nextElementSibling as HTMLElement | null
          if (otherTarget && otherTarget !== target) {
            slideUp(otherTarget, expandTime)
            const menuItem = otherTarget.closest('.menu-item') as HTMLElement | null
            if (menuItem) {
              menuItem.classList.remove('expand')
              menuItem.classList.add('closed')
            }
          }
        })

        const targetItemElm = target.closest('.menu-item') as HTMLElement | null
        if (!targetItemElm) return

        const targetStyle = getComputedStyle(target)
        if (
          targetItemElm.classList.contains('expand') ||
          (targetItemElm.classList.contains('active') && targetStyle.display === 'none')
        ) {
          targetItemElm.classList.remove('expand')
          targetItemElm.classList.add('closed')
          slideToggle(target, expandTime)
        } else {
          targetItemElm.classList.add('expand')
          targetItemElm.classList.remove('closed')
          slideToggle(target, expandTime)
        }
      })
    })
  }

  const menuBaseSelector = '.app-sidebar .menu > .menu-item.has-sub'
  const submenuBaseSelector = ' > .menu-submenu > .menu-item.has-sub'

  // menu
  const menuLinkSelector = menuBaseSelector + ' > .menu-link'
  const menus = [].slice.call(document.querySelectorAll(menuLinkSelector)) as HTMLElement[]
  handleSidebarMenuToggle(menus)

  // submenu lvl 1
  const submenuLvl1Selector = menuBaseSelector + submenuBaseSelector
  const submenusLvl1 = [].slice.call(document.querySelectorAll(submenuLvl1Selector + ' > .menu-link')) as HTMLElement[]
  handleSidebarMenuToggle(submenusLvl1)

  // submenu lvl 2
  const submenuLvl2Selector = menuBaseSelector + submenuBaseSelector + submenuBaseSelector
  const submenusLvl2 = [].slice.call(document.querySelectorAll(submenuLvl2Selector + ' > .menu-link')) as HTMLElement[]
  handleSidebarMenuToggle(submenusLvl2)

  handleSidebarMinifyFloatMenu()
})
</script>
<template>
  <div id="sidebar" class="app-sidebar">
    <PerfectScrollbar class="app-sidebar-content">
      <div class="menu">
        <template v-for="(menu, index) in appSidebarMenu" :key="index">
          <div v-if="menu.is_header" class="menu-header">{{ menu.text }}</div>
          <div v-else-if="menu.is_divider" class="menu-divider"></div>
          <template v-else>
            <SidebarNav v-if="menu.text" :menu="menu"></SidebarNav>
          </template>
        </template>
        <div class="p-3 px-4 mt-auto hide-on-minified">
          <a
            href="https://github.com/AmanMponda/frontend_bushman/blob/my-changes/README.md"
            target="_blank"
            class="btn d-block btn-secondary fw-600 rounded-pill"
          >
            <i class="fa fa-code-branch me-1 ms-n1 opacity-5"></i> Documentation
          </a>
        </div>
      </div>
    </PerfectScrollbar>
    <button class="app-sidebar-mobile-backdrop" @click="appSidebarMobileToggled"></button>
  </div>
</template>
