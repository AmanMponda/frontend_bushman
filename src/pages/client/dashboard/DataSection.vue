<template>
  <VaInnerLoading :loading="loadingStats">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
      <DataSectionItem
        v-for="metric in dashboardMetrics"
        :key="metric.id"
        :disabled="loadingStats"
        :title="metric.title"
        :value="metric.value"
        :change-text="metric.changeText"
        :up="metric.changeDirection === 'up'"
        :icon-background="metric.iconBackground"
        :icon-color="metric.iconColor"
      >
        <template #icon>
          <VaIcon :name="metric.icon" size="large" />
        </template>
      </DataSectionItem>
    </div>
  </VaInnerLoading>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useColors } from 'vuestic-ui'
import DataSectionItem from './DataSectionItem.vue'
import { mapActions, mapState } from 'pinia'
import { useStatsStore } from '../../../stores/stats-store'
import { DashboardMetric } from '../../../interfaces/IQuota'

export default defineComponent({
  name: 'DataSection',
  components: {
    DataSectionItem,
  },
  setup() {
    return {}
  },

  data() {
    const { getColor } = useColors()

    return {
      getColor,
    }
  },

  computed: {
    ...mapState(useStatsStore, ['loadingStats', 'quotaStats']),

    dashboardMetrics(): DashboardMetric[] {
      return [
        {
          id: 'totalquota',
          title: 'Total Quota Balance',
          value: this.quotaStats ? this.quotaStats.totalQuota : '0',
          icon: 'mso-folder_open',
          changeText: this.quotaStats ? this.quotaStats.quota : '',
          changeDirection: 'up',
          iconBackground: this.getColor('secondary'),
          iconColor: this.getColor('on-info'),
        },
        {
          id: 'provisioned',
          title: 'Total provisioned ',
          value: this.quotaStats ? this.quotaStats.provisioned : '0',
          icon: 'pets',
          changeText: this.quotaStats ? this.quotaStats.quota : '',
          changeDirection: 'up',
          iconBackground: this.getColor('warning'),
          iconColor: this.getColor('on-primary'),
        },
        {
          id: 'confirmed',
          title: ' Total Confirmed ',
          value: this.quotaStats ? this.quotaStats.confirmed : '0',
          icon: 'pets',
          changeText: this.quotaStats ? this.quotaStats.quota : '',
          changeDirection: 'up',
          iconBackground: this.getColor('success'),
          iconColor: this.getColor('on-primary'),
        },

        {
          id: 'cancelled',
          title: 'Total Cancelled ',
          value: this.quotaStats ? this.quotaStats.cancelled : '0',
          icon: 'pets',
          changeText: this.quotaStats ? this.quotaStats.quota : '',
          changeDirection: 'up',
          iconBackground: this.getColor('danger'),
          iconColor: this.getColor('on-primary'),
        },

        {
          id: 'taken',
          title: 'Total Taken',
          value: this.quotaStats ? this.quotaStats.taken : '0',
          icon: 'pets',
          changeText: this.quotaStats ? this.quotaStats.quota : '',
          changeDirection: 'up',
          iconBackground: this.getColor('primary'),
          iconColor: this.getColor('on-danger'),
        },
      ]
    },
  },
  mounted() {
    this.getStats()
  },
  methods: {
    ...mapActions(useStatsStore, ['getStats']),
  },
})
</script>

<style lang="scss" scoped></style>
