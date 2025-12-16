<script setup lang="ts">
import { useAppTopNavMenuStore } from '@/stores/app-top-nav-menu'
import { onMounted } from 'vue'
import { slideToggle } from '@/composables/slideToggle.js'
import { slideUp } from '@/composables/slideUp.js'
import TopNavNav from '@/components/app/TopNavNav.vue'

const appTopNavMenu = useAppTopNavMenuStore()

function handleUnlimitedTopNavRender() {
  'use strict'
  // function handle menu button action - next / prev
  function handleMenuButtonAction(element: HTMLElement, direction: string) {
    const obj = element.closest('.menu') as HTMLElement | null
    if (!obj) return
    const objStyle = window.getComputedStyle(obj)
    const bodyEl = document.querySelector('body')
    if (!bodyEl) return
    const bodyStyle = window.getComputedStyle(bodyEl)
    const targetCss = bodyStyle.getPropertyValue('direction') == 'rtl' ? 'margin-right' : 'margin-left'
    const marginLeft = parseInt(objStyle.getPropertyValue(targetCss), 10)
    const topNavEl = document.querySelector('.app-top-nav') as HTMLElement | null
    if (!topNavEl) return
    const containerWidth = topNavEl.clientWidth - topNavEl.clientHeight * 2
    let totalWidth = 0
    let finalScrollWidth = 0
    const controlPrevObj = obj.querySelector('.menu-control-start') as HTMLElement | null
    const controlPrevWidth = controlPrevObj ? controlPrevObj.clientWidth : 0
    const controlNextObj = obj.querySelector('.menu-control-end') as HTMLElement | null
    const controlNextWidth = controlNextObj ? controlNextObj.clientWidth : 0
    const controlWidth = controlPrevWidth + controlNextWidth

    const elms = [].slice.call(obj.querySelectorAll('.menu-item')) as HTMLElement[]
    if (elms) {
      elms.map(function (elm: HTMLElement) {
        if (!elm.classList.contains('menu-control')) {
          totalWidth += elm.clientWidth
        }
      })
    }

    switch (direction) {
      case 'next': {
        const widthLeft = totalWidth + marginLeft - containerWidth
        if (widthLeft <= containerWidth) {
          finalScrollWidth = widthLeft - marginLeft - controlWidth
          setTimeout(function () {
            const controlEnd = obj.querySelector('.menu-control.menu-control-end') as HTMLElement | null
            if (controlEnd) {
              controlEnd.classList.remove('show')
            }
          }, 300)
        } else {
          finalScrollWidth = containerWidth - marginLeft - controlWidth
        }

        if (finalScrollWidth !== 0) {
          obj.style.transitionProperty = 'height, margin, padding'
          obj.style.transitionDuration = '300ms'
          if (bodyStyle.getPropertyValue('direction') != 'rtl') {
            obj.style.marginLeft = '-' + finalScrollWidth + 'px'
          } else {
            obj.style.marginRight = '-' + finalScrollWidth + 'px'
          }
          setTimeout(function () {
            obj.style.transitionProperty = ''
            obj.style.transitionDuration = ''
            const controlStart = obj.querySelector('.menu-control.menu-control-start') as HTMLElement | null
            if (controlStart) {
              controlStart.classList.add('show')
            }
          }, 300)
        }
        break
      }
      case 'prev': {
        const widthLeft = -marginLeft

        if (widthLeft <= containerWidth) {
          const controlStart = obj.querySelector('.menu-control.menu-control-start') as HTMLElement | null
          if (controlStart) {
            controlStart.classList.remove('show')
          }
          finalScrollWidth = 0
        } else {
          finalScrollWidth = widthLeft - containerWidth + controlWidth
        }

        obj.style.transitionProperty = 'height, margin, padding'
        obj.style.transitionDuration = '300ms'

        if (bodyStyle.getPropertyValue('direction') != 'rtl') {
          obj.style.marginLeft = '-' + finalScrollWidth + 'px'
        } else {
          obj.style.marginRight = '-' + finalScrollWidth + 'px'
        }

        setTimeout(function () {
          obj.style.transitionProperty = ''
          obj.style.transitionDuration = ''
          const controlEnd = obj.querySelector('.menu-control.menu-control-end') as HTMLElement | null
          if (controlEnd) {
            controlEnd.classList.add('show')
          }
        }, 300)
        break
      }
    }
  }

  // handle page load active menu focus
  function handlePageLoadMenuFocus() {
    const targetMenu = document.querySelector('.app-top-nav .menu') as HTMLElement | null
    if (!targetMenu) {
      return
    }
    const bodyStyle = window.getComputedStyle(document.body)
    const topNavEl = document.querySelector('.app-top-nav') as HTMLElement | null
    const viewWidth = topNavEl?.clientWidth || 0
    let prevWidth = 0
    let fullWidth = 0
    const controlNextObj = targetMenu.querySelector('.menu-control-end') as HTMLElement | null
    const controlNextWidth = controlNextObj ? controlNextObj.clientWidth : 0
    let controlWidth = 0

    const elms = [].slice.call(document.querySelectorAll('.app-top-nav .menu > .menu-item')) as HTMLElement[]
    if (elms) {
      let found = false
      elms.map(function (elm: HTMLElement) {
        if (!elm.classList.contains('menu-control')) {
          fullWidth += elm.clientWidth
          if (!found) {
            prevWidth += elm.clientWidth
          }
          if (elm.classList.contains('active')) {
            found = true
          }
        }
      })
    }

    const elmEnd = targetMenu.querySelector('.menu-control.menu-control-end') as HTMLElement | null
    if (elmEnd) {
      if (prevWidth != fullWidth && fullWidth >= viewWidth) {
        elmEnd.classList.add('show')
        controlWidth += controlNextWidth
      } else {
        elmEnd.classList.remove('show')
      }
    }

    const elmStart = targetMenu.querySelector('.menu-control.menu-control-start') as HTMLElement | null
    if (elmStart) {
      if (prevWidth >= viewWidth && fullWidth >= viewWidth) {
        elmStart.classList.add('show')
      } else {
        elmStart.classList.remove('show')
      }
    }

    if (prevWidth >= viewWidth) {
      const finalScrollWidth = prevWidth - viewWidth + controlWidth
      if (bodyStyle.getPropertyValue('direction') != 'rtl') {
        targetMenu.style.marginLeft = '-' + finalScrollWidth + 'px'
      } else {
        targetMenu.style.marginRight = '-' + finalScrollWidth + 'px'
      }
    }
  }

  // handle menu next button click action
  const elmNext = document.querySelector('[data-toggle="app-top-nav-next"]') as HTMLElement | null
  if (elmNext) {
    elmNext.addEventListener('click', function (e: Event) {
      e.preventDefault()
      handleMenuButtonAction(this as HTMLElement, 'next')
    })
  }

  // handle menu prev button click action
  const elmPrev = document.querySelector('[data-toggle="app-top-nav-prev"]') as HTMLElement | null
  if (elmPrev) {
    elmPrev.addEventListener('click', function (e: Event) {
      e.preventDefault()
      handleMenuButtonAction(this as HTMLElement, 'prev')
    })
  }

  function enableFluidContainerDrag(containerClassName: string) {
    const container = document.querySelector(containerClassName) as HTMLElement | null
    if (!container) {
      return
    }
    const menu = container.querySelector('.menu') as HTMLElement | null
    if (!menu) return
    const menuItem = menu.querySelectorAll('.menu-item:not(.menu-control)')

    let startX: number | undefined
    let scrollLeft: number | undefined
    let mouseDown: boolean | undefined
    let menuWidth = 0
    let maxScroll = 0

    menuItem.forEach((element: Element) => {
      menuWidth += (element as HTMLElement).offsetWidth
    })

    container.addEventListener('mousedown', (e: MouseEvent) => {
      mouseDown = true
      startX = e.pageX
      scrollLeft = menu.style.marginLeft ? parseInt(menu.style.marginLeft, 10) : 0
      maxScroll = container.offsetWidth - menuWidth
    })

    container.addEventListener('touchstart', (e: TouchEvent) => {
      mouseDown = true
      const touch = e.targetTouches[0]
      startX = touch.pageX
      scrollLeft = menu.style.marginLeft ? parseInt(menu.style.marginLeft, 10) : 0
      maxScroll = container.offsetWidth - menuWidth
    })

    container.addEventListener('mouseup', () => {
      mouseDown = false
    })

    container.addEventListener('touchend', () => {
      mouseDown = false
    })

    container.addEventListener('mousemove', (e: MouseEvent) => {
      if (startX === undefined || !mouseDown) return
      if (window.innerWidth < 992) return
      e.preventDefault()
      const x = e.pageX
      const walkX = (x - startX) * 1
      const scrollLeftVal = scrollLeft || 0
      let totalMarginLeft = scrollLeftVal + walkX
      const controlEnd = menu.querySelector('.menu-control.menu-control-end') as HTMLElement | null
      const controlStart = menu.querySelector('.menu-control.menu-control-start') as HTMLElement | null
      if (totalMarginLeft <= maxScroll) {
        totalMarginLeft = maxScroll
        if (controlEnd) controlEnd.classList.remove('show')
      } else {
        if (controlEnd) controlEnd.classList.add('show')
      }
      if (menuWidth < container.offsetWidth) {
        if (controlStart) controlStart.classList.remove('show')
      }
      if (maxScroll > 0) {
        if (controlEnd) controlEnd.classList.remove('show')
      }
      if (totalMarginLeft > 0) {
        totalMarginLeft = 0
        if (controlStart) controlStart.classList.remove('show')
      } else {
        if (controlStart) controlStart.classList.add('show')
      }
      menu.style.marginLeft = totalMarginLeft + 'px'
    })

    container.addEventListener('touchmove', (e: TouchEvent) => {
      if (startX === undefined || !mouseDown) return
      if (window.innerWidth < 992) return
      e.preventDefault()
      const touch = e.targetTouches[0]
      const x = touch.pageX
      const walkX = (x - startX) * 1
      const scrollLeftVal = scrollLeft || 0
      let totalMarginLeft = scrollLeftVal + walkX
      const controlEnd = menu.querySelector('.menu-control.menu-control-end') as HTMLElement | null
      const controlStart = menu.querySelector('.menu-control.menu-control-start') as HTMLElement | null
      if (totalMarginLeft <= maxScroll) {
        totalMarginLeft = maxScroll
        if (controlEnd) controlEnd.classList.remove('show')
      } else {
        if (controlEnd) controlEnd.classList.add('show')
      }
      if (menuWidth < container.offsetWidth) {
        if (controlStart) controlStart.classList.remove('show')
      }
      if (maxScroll > 0) {
        if (controlEnd) controlEnd.classList.remove('show')
      }
      if (totalMarginLeft > 0) {
        totalMarginLeft = 0
        if (controlStart) controlStart.classList.remove('show')
      } else {
        if (controlStart) controlStart.classList.add('show')
      }
      menu.style.marginLeft = totalMarginLeft + 'px'
    })
  }

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 992) {
      const targetElm = document.querySelector('.app-top-nav')
      if (targetElm) {
        targetElm.removeAttribute('style')
      }
      const targetElm2 = document.querySelector('.app-top-nav .menu')
      if (targetElm2) {
        targetElm2.removeAttribute('style')
      }
      const targetElm3 = document.querySelectorAll('.app-top-nav .menu-submenu')
      if (targetElm3) {
        targetElm3.forEach((elm3) => {
          elm3.removeAttribute('style')
        })
      }
      handlePageLoadMenuFocus()
    }
    enableFluidContainerDrag('.app-top-nav')
  })

  if (window.innerWidth >= 992) {
    handlePageLoadMenuFocus()
    enableFluidContainerDrag('.app-top-nav')
  }
}

function handleTopNavToggle(menus: HTMLElement[], forMobile = false) {
  menus.map(function (menu: HTMLElement) {
    menu.addEventListener('click', function (e: Event) {
      e.preventDefault()

      if (!forMobile || (forMobile && document.body.clientWidth < 992)) {
        const target = (this as HTMLElement).nextElementSibling as HTMLElement | null
        if (!target) return
        menus.map(function (m: HTMLElement) {
          const otherTarget = m.nextElementSibling as HTMLElement | null
          if (otherTarget && otherTarget !== target) {
            slideUp(otherTarget)
            const menuItem = otherTarget.closest('.menu-item') as HTMLElement | null
            if (menuItem) {
              menuItem.classList.remove('expand')
              menuItem.classList.add('closed')
            }
          }
        })

        slideToggle(target)
      }
    })
  })
}

function handleTopNavSubMenu() {
  'use strict'

  const menuBaseSelector = '.app-top-nav .menu > .menu-item.has-sub'
  const submenuBaseSelector = ' > .menu-submenu > .menu-item.has-sub'

  // Menu - Toggle / Collapse
  const menuLinkSelector = menuBaseSelector + ' > .menu-link'
  const menus = [].slice.call(document.querySelectorAll(menuLinkSelector)) as HTMLElement[]
  handleTopNavToggle(menus, true)

  // Menu - Submenu lvl 1
  const submenuLvl1Selector = menuBaseSelector + submenuBaseSelector
  const submenusLvl1 = [].slice.call(document.querySelectorAll(submenuLvl1Selector + ' > .menu-link')) as HTMLElement[]
  handleTopNavToggle(submenusLvl1)

  // Menu - Submenu lvl 2
  const submenuLvl2Selector = menuBaseSelector + submenuBaseSelector + submenuBaseSelector
  const submenusLvl2 = [].slice.call(document.querySelectorAll(submenuLvl2Selector + ' > .menu-link')) as HTMLElement[]
  handleTopNavToggle(submenusLvl2)
}

onMounted(() => {
  handleUnlimitedTopNavRender()
  handleTopNavSubMenu()
})
</script>
<template>
  <div data-bs-theme="dark">
    <div id="top-nav" class="app-top-nav">
      <div class="menu">
        <template v-for="(menu, index) in appTopNavMenu" :key="index">
          <TopNavNav v-if="menu.text" :menu="menu"></TopNavNav>
        </template>
        <div class="menu-item menu-control menu-control-start">
          <a href="javascript:;" class="menu-link" data-toggle="app-top-nav-prev"><i class="fa fa-chevron-left"></i></a>
        </div>
        <div class="menu-item menu-control menu-control-end">
          <a href="javascript:;" class="menu-link" data-toggle="app-top-nav-next"
            ><i class="fa fa-chevron-right"></i
          ></a>
        </div>
      </div>
    </div>
  </div>
</template>
