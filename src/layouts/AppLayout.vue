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
      <div class="container-fluid content-container" style="padding-left: 0 !important; padding-right: 0 !important">
        <main style="padding-left: 0 !important; padding-right: 0 !important">
          <article style="padding-left: 0 !important; padding-right: 0 !important">
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

let paddingObserver = null

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

const removePadding = () => {
  // First, target .app-content if it exists (VueStudio's wrapper)
  const appContent = document.querySelector('.app-content')
  if (appContent) {
    appContent.style.setProperty('padding-left', '0', 'important')
    appContent.style.setProperty('padding-right', '0', 'important')
  }

  const content = document.getElementById('content')
  if (!content) return

  // Remove padding from all containers - more comprehensive
  const selectors = [
    '.app-content',
    '.container-fluid',
    '.content-container',
    'main',
    'article',
    '.row',
    '[class*="col-"]',
    '.navbar .container-fluid',
    '#content > div',
    '#content > div > div',
    '.sales-inquiries-page',
    '.price-list-page',
    '.layout-top-spacing',
    '.layout-spacing',
    '.panel',
    '.custom-table',
  ]

  selectors.forEach((selector) => {
    const elements = content.querySelectorAll(selector)
    elements.forEach((el) => {
      if (el) {
        el.style.setProperty('padding-left', '0', 'important')
        el.style.setProperty('padding-right', '0', 'important')
        el.style.setProperty('margin-left', '0', 'important')
        el.style.setProperty('margin-right', '0', 'important')
        el.style.setProperty('--bs-gutter-x', '0', 'important')
        // Remove Tailwind padding classes
        el.classList.remove('px-1', 'px-2', 'px-3', 'px-4', 'px-5', 'px-6', 'px-8', 'px-10', 'px-12', 'px-16', 'px-20')
        el.classList.remove('p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8', 'p-10', 'p-12', 'p-16', 'p-20')
      }
    })
  })

  // Specifically target Bootstrap row and columns to remove gutter
  const rows = content.querySelectorAll('.row')
  rows.forEach((row) => {
    row.style.setProperty('--bs-gutter-x', '0', 'important')
    row.style.setProperty('margin-left', '0', 'important')
    row.style.setProperty('margin-right', '0', 'important')
    const cols = row.querySelectorAll('[class*="col-"]')
    cols.forEach((col) => {
      col.style.setProperty('padding-left', '0', 'important')
      col.style.setProperty('padding-right', '0', 'important')
    })
  })

  // Also check for any element with computed padding and force remove it
  const allElements = content.querySelectorAll('*')
  allElements.forEach((el) => {
    const computed = window.getComputedStyle(el)
    const paddingLeft = parseFloat(computed.paddingLeft)
    const paddingRight = parseFloat(computed.paddingRight)

    // If element has horizontal padding, force remove it
    if (paddingLeft > 0 || paddingRight > 0) {
      // Check if it's not a table cell or other element that should have padding
      const tagName = el.tagName.toLowerCase()
      const isTableCell = tagName === 'td' || tagName === 'th'
      const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'button'
      const hasCustomTable = el.closest('.custom-table, .table, table')

      // Only remove padding from containers, not from table cells or inputs
      if (!isTableCell && !isInput && !hasCustomTable) {
        if (paddingLeft > 0) {
          el.style.setProperty('padding-left', '0', 'important')
        }
        if (paddingRight > 0) {
          el.style.setProperty('padding-right', '0', 'important')
        }
      }
    }
  })

  // Also check computed styles and override
  const allContainers = content.querySelectorAll('.container-fluid, .content-container')
  allContainers.forEach((el) => {
    const computed = window.getComputedStyle(el)
    if (parseFloat(computed.paddingLeft) > 0 || parseFloat(computed.paddingRight) > 0) {
      el.style.setProperty('padding-left', '0', 'important')
      el.style.setProperty('padding-right', '0', 'important')
    }
  })
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  onResize()
  // Ensure sidebar is minimized on mobile initially
  if (window.innerWidth < 768) {
    isSidebarMinimized.value = true
  }

  // #region agent log
  setTimeout(() => {
    const measureLayout = (selector, name, hypothesisId) => {
      const el = document.querySelector(selector)
      if (el) {
        const computed = window.getComputedStyle(el)
        const rect = el.getBoundingClientRect()
        const padding = {
          top: parseFloat(computed.paddingTop),
          right: parseFloat(computed.paddingRight),
          bottom: parseFloat(computed.paddingBottom),
          left: parseFloat(computed.paddingLeft),
        }
        const margin = {
          top: parseFloat(computed.marginTop),
          right: parseFloat(computed.marginRight),
          bottom: parseFloat(computed.marginBottom),
          left: parseFloat(computed.marginLeft),
        }
        fetch('http://127.0.0.1:7242/ingest/ab14651b-7c7c-4500-8f4c-553f5bb1f67b', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'AppLayout.vue:154',
            message: `Layout measurement: ${name}`,
            data: {
              selector,
              name,
              padding,
              margin,
              position: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
              offsetWidth: el.offsetWidth,
              clientWidth: el.clientWidth,
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'post-fix',
            hypothesisId,
          }),
        }).catch(() => {})
      }
    }
    const sidebar = document.getElementById('sidebar')
    const sidebarRect = sidebar ? sidebar.getBoundingClientRect() : null
    const navbar = document.querySelector('.navbar')
    const navbarRect = navbar ? navbar.getBoundingClientRect() : null

    measureLayout('#content', 'content', 'A')
    measureLayout('#content .container-fluid', 'container-fluid', 'B')
    measureLayout('#content .content-container', 'content-container', 'C')
    measureLayout('#content main', 'main', 'D')
    measureLayout('#content article', 'article', 'E')
    measureLayout('.navbar .container-fluid', 'navbar-container-fluid', 'F')
    measureLayout('.sales-inquiries-page', 'sales-inquiries-page', 'H')
    measureLayout('.sales-inquiries-page .row', 'sales-inquiries-row', 'I')
    measureLayout('.sales-inquiries-page .col-xl-12', 'sales-inquiries-col', 'J')
    measureLayout('.layout-top-spacing', 'layout-top-spacing', 'K')
    measureLayout('.panel', 'panel', 'L')
    measureLayout('.custom-table', 'custom-table', 'M')

    if (sidebarRect && navbarRect) {
      const content = document.getElementById('content')
      const contentRect = content ? content.getBoundingClientRect() : null
      if (contentRect) {
        fetch('http://127.0.0.1:7242/ingest/ab14651b-7c7c-4500-8f4c-553f5bb1f67b', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'AppLayout.vue:154',
            message: 'Layout positioning analysis',
            data: {
              sidebar: { x: sidebarRect.x, width: sidebarRect.width },
              navbar: { y: navbarRect.y, height: navbarRect.height },
              content: { x: contentRect.x, y: contentRect.y, width: contentRect.width },
              gapFromSidebar: contentRect.x - (sidebarRect.x + sidebarRect.width),
              gapFromNavbar: contentRect.y - (navbarRect.y + navbarRect.height),
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'post-fix',
            hypothesisId: 'G',
          }),
        }).catch(() => {})
      }
    }
  }, 500)
  // #endregion

  // Force remove padding multiple times to catch all renders
  removePadding()
  setTimeout(removePadding, 0)
  setTimeout(removePadding, 50)
  setTimeout(removePadding, 100)
  setTimeout(removePadding, 200)
  setTimeout(removePadding, 500)
  setTimeout(removePadding, 1000)
  setTimeout(removePadding, 2000)

  // Run continuously every 300ms for first 10 seconds to catch dynamic content
  let intervalCount = 0
  const interval = setInterval(() => {
    removePadding()
    intervalCount++
    if (intervalCount >= 33) {
      clearInterval(interval)
    }
  }, 300)

  // Use MutationObserver to catch dynamically added elements
  paddingObserver = new MutationObserver(() => {
    removePadding()
  })

  const content = document.getElementById('content')
  if (content) {
    paddingObserver.observe(content, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    })
  }
})

onBeforeUnmount(() => {
  if (paddingObserver) {
    paddingObserver.disconnect()
  }
  // Clear any intervals
  const intervals = setInterval(() => {}, 9999)
  for (let i = 1; i < intervals; i++) {
    clearInterval(i)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

onBeforeRouteUpdate(() => {
  if (isTablet.value) {
    isSidebarMinimized.value = true
  }
  // Remove padding when route changes
  setTimeout(removePadding, 0)
  setTimeout(removePadding, 100)
})
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  width: 100% !important;
  min-width: 100% !important;
  align-items: stretch;
  min-height: 100vh;
  background-color: #e0e4eb;
  font-size: 18px !important;
  /* Prevent shrinking */
  -webkit-text-size-adjust: 100% !important;
  -moz-text-size-adjust: 100% !important;
  text-size-adjust: 100% !important;
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
  width: 100% !important;
  min-width: 100% !important;
  padding: 0;
  min-height: 100vh;
  transition: all 0.3s;
  background-color: #e0e4eb;
  font-size: 18px !important;
  /* Prevent shrinking */
  -webkit-text-size-adjust: 100% !important;
  -moz-text-size-adjust: 100% !important;
  text-size-adjust: 100% !important;

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
  padding-left: 0 !important;
  padding-right: 0 !important;
}

main,
article {
  background-color: transparent !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
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

<style lang="scss">
/* Global styles to override Bootstrap - must not be scoped */
#content .container-fluid,
#content .content-container,
#content main,
#content article,
#content .container-fluid .row,
#content [class*='col-'],
.container-fluid,
.content-container {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

#content .container-fluid .row,
.container-fluid .row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

#content [class*='col-'],
[class*='col-'] {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

/* Override Bootstrap's gutter variable */
#content .container-fluid,
.container-fluid {
  --bs-gutter-x: 0 !important;
}

/* Remove padding from all rows and columns within content */
#content .row {
  --bs-gutter-x: 0 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

#content .row [class*='col-'] {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

/* Remove padding from page-specific classes */
#content .sales-inquiries-page,
#content .price-list-page,
#content .layout-top-spacing,
#content .layout-spacing,
#content .panel,
#content .custom-table {
  padding-left: 0 !important;
  padding-right: 0 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

/* Ensure all page wrappers have no horizontal padding */
#content > .container-fluid > main > article > * {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

/* Target all direct children of article */
#content article > * {
  padding-left: 0 !important;
  padding-right: 0 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

/* Remove max-width constraints that might limit content width */
#content .container-fluid,
#content .content-container,
#content main,
#content article {
  max-width: 100% !important;
  width: 100% !important;
}

/* Ensure all page wrappers take full width */
#content .sales-inquiries-page,
#content .price-list-page {
  width: 100% !important;
  max-width: 100% !important;
}
</style>
