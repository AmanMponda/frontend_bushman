<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  target: string
}

defineProps<Props>()

const elm = ref<HTMLElement | null>(null)

function scrollTo(event: Event) {
  event.preventDefault()

  const targetAttr = (event.currentTarget as HTMLElement).getAttribute('href') || ''
  const targetElm = document.querySelector(targetAttr)
  const targetHeader = document.querySelector('.app-header') as HTMLElement
  if (targetHeader && targetElm) {
    const targetHeight = targetHeader.offsetHeight
    const targetTop = (targetElm as HTMLElement).offsetTop - targetHeight - 24
    window.scrollTo({ top: targetTop, behavior: 'smooth' })
  }
}
</script>
<template>
  <a ref="elm" class="nav-link" :href="target" @click="scrollTo">
    <slot />
  </a>
</template>
