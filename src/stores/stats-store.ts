// VITE_APP_SALES_CONFIRMATION_CONTRACT_VSET_URL

import { defineStore } from 'pinia'
import axios from 'axios'
import { QuotaStats } from '../interfaces/IQuota'
import { buildApiUrl } from '../config/api'
// import { format } from 'date-fns'
// import { formatDateTime } from '../services/utils'

export const useStatsStore = defineStore('stats', {
  state: () => {
    return {
      loadingStats: false,
      quotaStats: {} as QuotaStats,
    }
  },

  actions: {
    async getStats() {
      this.loadingStats = true
      const url = buildApiUrl(import.meta.env.VITE_APP_QUOTA_STATS_URL || 'reportings/quota-stats/')

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await axios.request(config)

      if (response.status === 200) {
        // Backend returns { success: true, data: [...species], totals: {...}, pdf: "..." }
        const totals = response.data.totals || {}
        const quotaName =
          response.data.data && response.data.data.length > 0 ? response.data.data[0].quota?.name : 'Unknown'

        this.quotaStats = {
          confirmed: totals.confirmed || 0,
          pending: 0, // Not provided in current backend response
          cancelled: totals.cancelled || 0,
          taken: totals.taken || 0,
          provisioned: totals.provisioned || 0,
          totalQuota: totals.total_quota_balance || 0,
          quota: quotaName,
        }

        console.log(this.quotaStats)
        this.loadingStats = false
        return response
      }
      return response
    },
  },
})
