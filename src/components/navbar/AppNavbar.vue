<template>
  <div class="top-nav-bar">
    <div class="nav-content">
      <div class="nav-left">
        <i class="fa fa-bars hamburger-menu" @click="$emit('toggle-sidebar')"></i>
        <img src="/logo.png" class="nav-logo" alt="BUSHMAN Logo" />
      </div>
      <div class="nav-right">
        <div class="user-info">
          <div class="user-avatar-icon">
            <img :src="avatarImage" alt="User Avatar" />
            <span class="status-indicator"></span>
          </div>
          <span class="user-email">{{ user?.email || 'No email available' }}</span>
        </div>
        <button class="settings-btn">
          <i class="fa fa-cog"></i>
        </button>
      </div>
    </div>
    <div class="nav-bottom-bar"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import avatarImage from '@/images/Avatars.png'

defineProps({
  isMobile: { type: Boolean, default: false },
})

defineEmits(['toggle-sidebar'])

const authStore = useAuthStore()
const user = computed(() => {
  return authStore.currentUser || JSON.parse(sessionStorage.getItem('user') || 'null')
})
</script>

<style lang="scss" scoped>
/* TOP NAVIGATION BAR */
.top-nav-bar {
  background: #ffffff;
  width: 100%;
  position: sticky;
  top: 0;
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

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
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
</style>
