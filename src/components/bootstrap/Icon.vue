<template>
  <i v-if="!component" :class="iconClasses" :style="iconStyles">
    {{ iconName }}
    <slot></slot>
  </i>
  <component :is="component" v-else :class="iconClasses" :style="iconStyles" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name?: string
  size?: 'small' | 'medium' | 'large' | number
  color?: string
  component?: any
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
})

const iconName = computed(() => {
  if (!props.name) return ''
  return props.name.replace(/^mso-/, '')
})

const iconClasses = computed(() => {
  const classes: string[] = []

  if (props.name && !props.component) {
    classes.push('material-icons')

    if (props.size === 'small') {
      classes.push('md-18')
    } else if (props.size === 'large') {
      classes.push('md-36')
    } else {
      classes.push('md-24')
    }
  }

  return classes.join(' ')
})

const iconStyles = computed(() => {
  const styles: Record<string, string> = {}

  if (props.color) {
    styles.color = props.color
  }

  if (typeof props.size === 'number') {
    styles.fontSize = `${props.size}px`
  }

  return styles
})
</script>

<style scoped>
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'liga';
}

.material-icons.md-18 {
  font-size: 18px;
}

.material-icons.md-24 {
  font-size: 24px;
}

.material-icons.md-36 {
  font-size: 36px;
}
</style>
