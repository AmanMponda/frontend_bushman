<template>
  <div class="sales-calendar-page">
    <Calendar />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Calendar from './components/Calendar.vue'

export default defineComponent({
  name: 'SalesCalendarPage',
  components: {
    Calendar,
  },

  mounted() {
    console.log('SalesCalendarPage mounted')
  },
})
</script>

<style scoped>
.sales-calendar-page {
  width: 100%;
  min-height: 100vh;
  padding: 0;
}
</style>
