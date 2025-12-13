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

defineProps<{
  menu: MenuItem
}>()

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
</script>
<template>
  <!-- menu with submenu -->
  <div v-if="menu.children" class="menu-item has-sub" :class="{ active: subIsActive(menu.children) }">
    <a class="menu-link">
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
        <TopNavNav :menu="submenu"></TopNavNav>
      </template>
    </div>
  </div>

  <!-- menu without submenu -->
  <RouterLink v-else v-slot="{ navigate, href, isActive }" :to="menu.url" custom>
    <div class="menu-item" :class="{ active: isActive }">
      <a :href="href" class="menu-link" @click="navigate">
        <span v-if="menu.icon" class="menu-icon">
          <i :class="menu.icon"></i>
          <span v-if="menu.label" class="menu-icon-label">{{ menu.label }}</span>
        </span>
        <span class="menu-text">{{ menu.text }}</span>
      </a>
    </div>
  </RouterLink>
</template>
