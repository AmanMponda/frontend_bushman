<script setup lang="ts">
import { useAppOptionStore } from '@/stores/app-option'
import { useAppVariableStore, generateVariables } from '@/stores/app-variable'
import { onMounted } from 'vue'
import { Tooltip } from 'bootstrap'
import useEmitter from '@/composables/useEmitter'

const appOption = useAppOptionStore()
const appVariable = useAppVariableStore()
const emitter = useEmitter()

const themeList = [
  { name: 'Pink', bgClass: 'bg-pink', themeClass: 'theme-pink' },
  { name: 'Red', bgClass: 'bg-red', themeClass: 'theme-red' },
  { name: 'Orange', bgClass: 'bg-warning', themeClass: 'theme-warning' },
  { name: 'Yellow', bgClass: 'bg-yellow', themeClass: 'theme-yellow' },
  { name: 'Lime', bgClass: 'bg-lime', themeClass: 'theme-lime' },
  { name: 'Green', bgClass: 'bg-green', themeClass: 'theme-green' },
  { name: 'Teal', bgClass: 'bg-teal', themeClass: 'theme-teal' },
  { name: 'Cyan', bgClass: 'bg-info', themeClass: 'theme-info' },
  { name: 'Default', bgClass: 'bg-primary', themeClass: 'theme-primary' },
  { name: 'Purple', bgClass: 'bg-purple', themeClass: 'theme-purple' },
  { name: 'Indigo', bgClass: 'bg-indigo', themeClass: 'theme-indigo' },
  { name: 'Gray', bgClass: 'bg-gray-200', themeClass: 'theme-gray-200' },
]

function reloadVariable() {
  const newVariables = generateVariables()
  appVariable.font = newVariables.font
  appVariable.color = newVariables.color
}

function appThemePanelToggled(event: Event) {
  event.preventDefault()

  appOption.appThemePanelToggled = !appOption.appThemePanelToggled

  if (localStorage) {
    localStorage.appThemePanelToggled = appOption.appThemePanelToggled
  }
}

function toggleTheme(event: Event, themeClass: string) {
  event.preventDefault()

  appOption.appThemeClass = themeClass

  if (localStorage) {
    localStorage.appThemeClass = appOption.appThemeClass
  }
  setThemeClass(localStorage.appThemeClass)
}

function toggleDarkMode() {
  if (localStorage) {
    localStorage.appDarkMode = appOption.appDarkMode
  }
  setDarkMode(String(localStorage.appDarkMode))
}

function setDarkMode(darkMode: string | boolean) {
  const darkModeStr = String(darkMode)
  if (darkModeStr == 'true') {
    document.documentElement.setAttribute('data-bs-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-bs-theme')
  }
  emitter.emit('theme-reload', true)
  reloadVariable()
}

function setThemeClass(themeClass: string) {
  for (let x = 0; x < document.body.classList.length; x++) {
    const targetClass = document.body.classList[x]
    if (targetClass.search('theme-') > -1) {
      document.body.classList.remove(targetClass)
    }
  }
  document.body.classList.add(themeClass)
  appVariable.color.theme = getComputedStyle(document.body).getPropertyValue('--bs-theme').trim()
  appVariable.color.themeRgb = getComputedStyle(document.body).getPropertyValue('--bs-theme-rgb').trim()

  emitter.emit('theme-reload', true)
}

onMounted(() => {
  const elm = document.querySelectorAll('[data-bs-toggle="tooltip"]')

  for (let i = 0; i < elm.length; i++) {
    new Tooltip(elm[i])
  }

  if (localStorage) {
    if (localStorage.appThemePanelToggled) {
      appOption.appThemePanelToggled = JSON.parse(localStorage.appThemePanelToggled)
    }
    if (localStorage.appThemeClass) {
      appOption.appThemeClass = localStorage.appThemeClass
      setThemeClass(localStorage.appThemeClass)
    }
    if (localStorage.appDarkMode) {
      appOption.appDarkMode = localStorage.appDarkMode
      setDarkMode(appOption.appDarkMode)
    }
  }
})
</script>
<template>
  <!-- BEGIN theme-panel -->
  <div class="theme-panel" :class="{ active: appOption.appThemePanelToggled }">
    <a href="#" class="theme-collapse-btn" @click="appThemePanelToggled"><i class="fa fa-cog"></i></a>
    <div class="theme-panel-content">
      <ul class="theme-list clearfix">
        <li
          v-for="(theme, index) in themeList"
          :key="index"
          :class="{
            active:
              appOption.appThemeClass == theme.themeClass || (!appOption.appThemeClass && theme.name == 'Default'),
          }"
        >
          <a
            href="javascript:;"
            :class="theme.bgClass"
            data-bs-toggle="tooltip"
            data-bs-trigger="hover"
            data-bs-container="body"
            :data-bs-title="theme.name"
            @click="(event) => toggleTheme(event, theme.themeClass)"
            >&nbsp;</a
          >
        </li>
      </ul>
      <hr class="mb-0" />
      <div class="row mt-10px pt-3px">
        <div class="col-9 control-label text-body fw-bold">
          <div>
            Dark Mode
            <span class="badge bg-theme text-theme-color ms-1 position-relative py-4px px-6px" style="top: -1px"
              >NEW</span
            >
          </div>
          <div class="lh-14 fs-13px">
            <small class="text-body opacity-50">
              Adjust the appearance to reduce glare and give your eyes a break.
            </small>
          </div>
        </div>
        <div class="col-3 d-flex">
          <div class="form-check form-switch ms-auto mb-0 mt-2px">
            <input
              id="appThemeDarkMode"
              v-model="appOption.appDarkMode"
              type="checkbox"
              class="form-check-input"
              true-value="true"
              value="true"
              @change="toggleDarkMode()"
            />
            <label class="form-check-label" for="appThemeDarkMode">&nbsp;</label>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END theme-panel -->
</template>
