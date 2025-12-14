<template>
  <div class="wrapper">
    <!-- Sidebar -->
    <nav id="sidebar" :class="['sidebar', { active: !isSidebarMinimized }]" :style="{ width: sidebarWidth }">
      <AppSidebar :minimized="isSidebarMinimized" :mobile="isMobile" />
    </nav>

    <!-- Page Content -->
    <div id="content" :style="{ marginLeft: contentMargin }">
      <!-- Top Navbar -->
      <AppNavbar :is-mobile="isMobile" @toggleSidebar="toggleSidebar" />

      <!-- Main Content -->
      <div class="container-fluid content-container">
        <main>
          <article>
            <RouterView :key="$route.fullPath" />
          </article>
        </main>
      </div>
    </div>

    <!-- Overlay for mobile -->
    <div v-if="isMobile && !isSidebarMinimized" class="overlay" @click="isSidebarMinimized = true"></div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'

import { useGlobalStore } from '../stores/global-store'

import AppNavbar from '../components/navbar/AppNavbar.vue'
import AppSidebar from '../components/sidebar/AppSidebar.vue'

const GlobalStore = useGlobalStore()
const $route = useRoute()

const isMobile = ref(false)
const isTablet = ref(false)
const { isSidebarMinimized } = storeToRefs(GlobalStore)

const sidebarWidth = computed(() => {
  if (isMobile.value) {
    return '280px' // Always full width on mobile, visibility controlled by margin-left
  }
  return isSidebarMinimized.value ? '80px' : '280px'
})

const contentMargin = computed(() => {
  if (isMobile.value) {
    return '0'
  }
  return isSidebarMinimized.value ? '80px' : '280px'
})

const onResize = () => {
  const width = window.innerWidth
  isMobile.value = width < 576
  isTablet.value = width < 768
  // Only auto-minimize on mobile/tablet, not on desktop
  if (width < 768 && !isSidebarMinimized.value) {
    // Keep current state on resize, don't force minimize
  }
}

const toggleSidebar = () => {
  isSidebarMinimized.value = !isSidebarMinimized.value
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  onResize()
  // Ensure sidebar is minimized on mobile initially
  if (window.innerWidth < 768) {
    isSidebarMinimized.value = true
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

onBeforeRouteUpdate(() => {
  if (isTablet.value) {
    isSidebarMinimized.value = true
  }
})
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  width: 100%;
  align-items: stretch;
  min-height: 100vh;
  background-color: #e0e4eb;
}

#sidebar {
  min-height: 100vh;
  background: #e0e4eb;
  color: #212837;
  transition: all 0.3s;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;

  @media (min-width: 769px) {
    min-width: 280px;
    max-width: 280px;
  }

  @media (max-width: 768px) {
    min-width: 280px;
    max-width: 280px;

    &:not(.active) {
      margin-left: -280px;
    }

    &.active {
      margin-left: 0;
    }
  }
}

#content {
  width: 100%;
  padding: 0;
  min-height: 100vh;
  transition: all 0.3s;
  background-color: #e0e4eb;

  @media (max-width: 768px) {
    margin-left: 0 !important;
  }
}

.container-fluid {
  background-color: transparent !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.content-container {
  padding: 0 !important;
  padding-bottom: 1rem !important;
  padding-left: 0.25rem !important;
  padding-right: 0.25rem !important;
}

main,
article {
  background-color: transparent !important;
}

.overlay {
  display: block;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 1;
  transition: all 0.3s;
  top: 0;
  left: 0;
}
</style>
