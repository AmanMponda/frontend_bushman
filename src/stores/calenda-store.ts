// VITE_APP_CALENDAR_STATS_VSET_URL

import { defineStore } from 'pinia'
import axios from 'axios'
// import { format } from 'date-fns'
// import { formatDateTime } from '../services/utils'

export const useCalendarStore = defineStore('calendar_store', {
  state: () => {
    return {
      events: [],
    }
  },

  actions: {
    async getCalendarStats() {
      const url =
        import.meta.env.VITE_APP_BASE_URL +
        import.meta.env.VITE_APP_SALES_CONFIRMATION_VSET_URL +
        '?status_list=confirmed,provision_sales'

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await axios.request(config)
      return response
    },
  },
})
