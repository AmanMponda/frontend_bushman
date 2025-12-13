<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAppOptionStore } from '@/stores/app-option'
import { ProgressFinisher, useProgress } from '@marcoschulte/vue3-progress'
import AppSidebar from '@/components/app/Sidebar.vue'
import AppHeader from '@/components/app/Header.vue'
import AppTopNav from '@/components/app/TopNav.vue'
import AppThemePanel from '@/components/app/ThemePanel.vue'
import router from './router'

const appOption = useAppOptionStore()

const progresses = [] as ProgressFinisher[]

router.beforeEach(async () => {
  progresses.push(useProgress().start())
  appOption.appSidebarMobileToggled = false
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0

  const targetElm = [].slice.call(document.querySelectorAll('.app-sidebar .menu-submenu'))
  targetElm.forEach((elm: HTMLElement) => {
    elm.style.display = ''
  })
})
router.afterEach(async () => {
  progresses.pop()?.finish()
})

onMounted(() => {
  document.querySelector('body')?.classList.add('app-init')
})
</script>

<template>
  <div
    class="app"
    :class="{
      'app-header-menu-search-toggled': appOption.appHeaderSearchToggled,
      'app-sidebar-minified': appOption.appSidebarMinified,
      'app-sidebar-collapsed': appOption.appSidebarCollapsed,
      'app-sidebar-mobile-toggled': appOption.appSidebarMobileToggled,
      'app-sidebar-mobile-closed': appOption.appSidebarMobileClosed,
      'app-content-full-height': appOption.appContentFullHeight,
      'app-content-full-width': appOption.appSidebarHide,
      'app-with-top-nav': appOption.appTopNav,
      'app-without-sidebar': appOption.appSidebarHide,
      'app-without-header': appOption.appHeaderHide,
      'app-boxed-layout': appOption.appBoxedLayout,
      'app-footer-fixed': appOption.appFooterFixed,
      'vh-100': appOption.appVh100,
    }"
  >
    <Vue3ProgressBar />
    <AppHeader v-if="!appOption.appHeaderHide" />
    <AppTopNav v-if="appOption.appTopNav" />
    <AppSidebar v-if="!appOption.appSidebarHide" />
    <div class="app-content" :class="appOption.appContentClass">
      <RouterView></RouterView>
    </div>
    <AppThemePanel />
    <ToastContainer />
  </div>
</template>

<style lang="scss">
html,
body {
  margin: 0;
  min-width: 20rem;
  background-color: #e0e4eb;
  min-height: 100vh;
}

#app {
  font-family: 'Inter', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #e0e4eb;
  min-height: 100vh;
}

.app {
  background-color: #e0e4eb;
  min-height: 100vh;
}
</style>
