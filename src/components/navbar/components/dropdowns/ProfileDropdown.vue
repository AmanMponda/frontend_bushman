<template>
  <div class="profile-dropdown-wrapper">
    <div class="dropdown">
      <a
        href="#"
        data-bs-toggle="dropdown"
        data-display="static"
        class="profile-dropdown__anchor d-flex align-items-center text-decoration-none text-dark"
      >
        <slot />
        <img
          :src="`${baseUrl}pholder.jpeg`"
          alt="User"
          class="ms-2 rounded-circle"
          style="width: 32px; height: 32px; object-fit: cover"
        />
      </a>
      <div class="dropdown-menu dropdown-menu-end">
        <template v-for="group in options" :key="group.name">
          <h6 v-if="group.name" class="dropdown-header text-body-emphasis mb-1 text-uppercase">
            {{ t(`user.${group.name}`) }}
          </h6>
          <template v-for="item in group.list" :key="item.name">
            <RouterLink
              v-if="item.to"
              :to="{ name: item.to }"
              class="dropdown-item d-flex align-items-center"
              @click="clearSessionStorageOnLogout(item)"
            >
              <i class="material-icons me-2 text-secondary" style="font-size: 18px">{{ item.icon }}</i>
              {{ t(`user.${item.name}`) }}
            </RouterLink>
            <a v-else-if="item.href" :href="item.href" target="_blank" class="dropdown-item d-flex align-items-center">
              <i class="material-icons me-2 text-secondary" style="font-size: 18px">{{ item.icon }}</i>
              {{ t(`user.${item.name}`) }}
            </a>
            <div v-if="group.separator && item === group.list[group.list.length - 1]" class="dropdown-divider"></div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const baseUrl = import.meta.env.BASE_URL

const { t } = useI18n()

type ProfileListItem = {
  name: string
  to?: string
  href?: string
  icon: string
}

type ProfileOptions = {
  name: string
  separator: boolean
  list: ProfileListItem[]
}

withDefaults(
  defineProps<{
    options?: ProfileOptions[]
  }>(),
  {
    options: () => [
      {
        name: '',
        separator: false,
        list: [
          {
            name: 'logout',
            to: 'login',
            icon: 'logout',
          },
        ],
      },
    ],
  },
)

const clearSessionStorageOnLogout = (item: ProfileListItem) => {
  if (item.name === 'logout') {
    sessionStorage.clear()
  }
}
</script>

<style lang="scss" scoped>
.profile-dropdown-wrapper {
  .profile-dropdown__anchor {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  .dropdown-menu {
    min-width: 200px;
  }

  .dropdown-item {
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
}
</style>
