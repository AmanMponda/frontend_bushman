<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { slideToggle } from '@/composables/slideToggle.js'
import { useAppOptionStore } from '@/stores/app-option'
import { useAuthStore } from '@/stores/auth'
import { RouterLink, useRouter } from 'vue-router'
import avatarImage from '@/images/Avatars.png'

const appOption = useAppOptionStore()
const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => {
  return authStore.currentUser || JSON.parse(sessionStorage.getItem('user') || 'null')
})

const showProfileDropdown = ref(false)

function toggleAppSidebarMinify() {
  if (!(appOption.appTopNav && appOption.appSidebarHide)) {
    appOption.appSidebarMinified = !appOption.appSidebarMinified
  }
}
function toggleAppSidebarMobileToggled() {
  if (appOption.appTopNav && appOption.appSidebarHide) {
    slideToggle(document.querySelector('.app-top-nav'))
    window.scrollTo(0, 0)
  } else {
    appOption.appSidebarMobileToggled = !appOption.appSidebarMobileToggled
  }
}
function handleHamburgerClick() {
  // Toggle sidebar for both mobile and desktop
  if (appOption.appTopNav && appOption.appSidebarHide) {
    toggleAppSidebarMobileToggled()
  } else {
    toggleAppSidebarMinify()
    toggleAppSidebarMobileToggled()
  }
}
function toggleProfileDropdown() {
  showProfileDropdown.value = !showProfileDropdown.value
}
function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.user-profile-dropdown')) {
    showProfileDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
<template>
  <div class="top-nav-bar">
    <div class="nav-content">
      <div class="nav-left">
        <i class="fa fa-bars hamburger-menu" @click="handleHamburgerClick"></i>
        <img src="/logo.png" class="nav-logo" alt="BUSHMAN Logo" />
      </div>
      <div class="nav-right">
        <div class="user-profile-dropdown">
          <div class="user-info" @click="toggleProfileDropdown">
            <div class="user-avatar-icon">
              <img :src="avatarImage" alt="User Avatar" />
              <span class="status-indicator"></span>
            </div>
            <span class="user-email">{{ user?.email || 'No email available' }}</span>
          </div>
          <div v-if="showProfileDropdown" class="profile-dropdown-menu">
            <a href="#" class="dropdown-item" @click.prevent>
              <span>Profile Setting</span>
              <i class="fa fa-wrench"></i>
            </a>
            <a href="#" class="dropdown-item" @click.prevent="handleLogout">
              <span>Log Out</span>
              <i class="fa fa-toggle-off"></i>
            </a>
          </div>
        </div>
        <button class="settings-btn">
          <i class="fa fa-cog"></i>
        </button>
      </div>
    </div>
    <div class="nav-bottom-bar"></div>
  </div>
</template>

<style scoped>
/* TOP NAVIGATION BAR */
.top-nav-bar {
  background: #ffffff;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.nav-content {
  padding: 12px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hamburger-menu {
  font-size: 18px;
  color: #333;
  cursor: pointer;
  padding: 8px;
}

.nav-logo {
  height: 35px;
  object-fit: contain;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-profile-dropdown {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.user-avatar-icon {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 9px;
  height: 9px;
  background-color: #00d4aa;
  border: 2px solid #ffffff;
  border-radius: 50%;
}

.user-email {
  font-size: 13px;
  color: #333;
  font-weight: 700;
}

.settings-btn {
  background: transparent;
  border: none;
  color: #666;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  transition: color 0.2s;
}

.settings-btn:hover {
  color: #333;
}

.nav-bottom-bar {
  height: 1px;
  background: #d0d0d0;
  width: 100%;
}

.profile-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  padding: 8px 0;
  z-index: 1001;
  border: 1px solid #e0e0e0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.2s;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item span {
  flex: 1;
}

.dropdown-item i {
  color: #4a90e2;
  font-size: 16px;
  margin-left: 12px;
}
</style>
