<template>
  <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
    <div class="flex flex-col md:flex-row gap-2 justify-start">
      <VaButton v-if="!showList" class="px-2 py-2" icon="arrow_back" size="small" @click="goBack"> Go Back </VaButton>
    </div>
    <VaButtonGroup v-if="!showCreateNew">
      <VaButton
        class="px-2 py-2"
        color="primary"
        label="Add New Quota"
        icon="add"
        :border-color="'primary'"
        round
        preset="secondary"
        size="small"
        @click="showForms"
      >
        Add a new Price List
      </VaButton>
    </VaButtonGroup>
  </div>
</template>

<script>
import VaButton from '@/components/VaButton'
import VaButtonGroup from '@/components/VaButtonGroup'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageControlHeaderButtons',
  components: {
    VaButton,
    VaButtonGroup,
  },
  props: {
    showList: {
      type: Boolean,
      required: true,
    },
    showCreateNew: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['on-btn-clicked', 'on-got-back-btn-clicked'],
  methods: {
    goBack() {
      this.$emit('on-got-back-btn-clicked')
    },
    showForms() {
      this.$emit('on-btn-clicked')
    },
  },
})
</script>
