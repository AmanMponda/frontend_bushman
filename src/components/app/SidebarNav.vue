<script setup lang="ts">
import { useRouter } from 'vue-router'

interface MenuItem {
  icon?: string
  text: string
  url: string
  highlight?: boolean
  label?: string
  children?: MenuItem[]
}

const props = defineProps<{
  menu: MenuItem
}>()

// Call useRouter at setup level, not inside functions
const router = useRouter()

function subIsActive(urls: MenuItem[]) {
  const currentRoute = router?.currentRoute?.value?.path || ''
  let match = false

  for (let x = 0; x < urls.length; x++) {
    if (urls[x].url === currentRoute) {
      match = true
    }
  }

  return match
}

function handleMenuClick(e: MouseEvent) {
  // If menu has a URL and no children, navigate immediately
  if (props.menu.url && !props.menu.children) {
    e.preventDefault()
    router.push(props.menu.url)
  }
  // If menu has children and a URL, navigate on click
  // The submenu toggle is handled by Sidebar.vue
  else if (props.menu.url && props.menu.children) {
    // Allow both navigation and submenu toggle
    // Navigation happens, submenu toggle is handled by Sidebar.vue
  }
}
</script>
<template>
  <!-- menu with submenu -->
  <div v-if="menu.children" class="menu-item has-sub" :class="{ active: subIsActive(menu.children) }">
    <a class="menu-link" :href="menu.url || '#'" @click="handleMenuClick">
      <span v-if="menu.icon" class="menu-icon">
        <i :class="menu.icon"></i>
        <span
          v-if="menu.highlight"
          class="w-5px h-5px rounded-3 bg-theme position-absolute top-0 end-0 mt-3px me-3px"
        ></span>
      </span>
      <span class="menu-text">{{ menu.text }}</span>
      <span v-if="menu.children" class="menu-caret"><b class="caret"></b></span>
    </a>
    <div class="menu-submenu">
      <template v-for="(submenu, index) in menu.children" :key="index">
        <SidebarNav :menu="submenu"></SidebarNav>
      </template>
    </div>
  </div>

  <!-- menu without submenu -->
  <RouterLink v-else v-slot="{ navigate, href, isActive }" :to="menu.url" custom>
    <div class="menu-item" :class="{ active: isActive }">
      <a
        :href="href"
        class="menu-link"
        @click="
          (e) => {
            e.preventDefault()
            navigate()
          }
        "
      >
        <span v-if="menu.icon" class="menu-icon">
          <i :class="menu.icon"></i>
          <span v-if="menu.label" class="menu-icon-label">{{ menu.label }}</span>
        </span>
        <span class="menu-text">{{ menu.text }}</span>
      </a>
    </div>
  </RouterLink>
</template>
