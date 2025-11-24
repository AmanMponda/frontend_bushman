import { defineStore } from 'pinia'
import axios from 'axios'
import { format } from 'date-fns'

export const useQuotaStore = defineStore('quota', {
  state: () => {
    return {
      quotas: [] as any,
    }
  },

  actions: {
    generateQuotaYear(startDate: any, endDate: any) {
      const startYear = new Date(startDate).getFullYear()
      const nextYear = new Date(endDate).getFullYear()
      const quotaYear = `${startYear}/${nextYear}`

      // Return an object with start_date, end_date, and the generated quota_year
      return quotaYear
    },
    // 1. end date: Date has wrong format. Use one of these formats instead: YYYY-MM-DD.
    async getQuotas(id: any) {
      let url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_QUOTAS_URL
      if (id !== null) {
        url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_QUOTAS_URL + '?quota_id=' + id
      }

      //   const axios = require('axios')

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
        this.quotas = response.data.data
        return response
      } else {
        return response
      }
    },
    async createQuota(quota: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_QUOTAS_URL

      // [
      //   {
      //     id: 1,
      //     quantity: 20,
      //   },
      // ]

      const q_data = JSON.stringify({
        name: quota.name,
        description: quota.description,
        start_date: format(quota.start_date, 'yyyy-MM-dd'),
        end_date: format(quota.end_date, 'yyyy-MM-dd'),
      })
      // const data = JSON.stringify({
      //   name: quota.name,
      //   description: quota.description,
      //   start_date: quota.start_date?.toISOString().split('T')[0],
      //   end_date: quota.end_date.toISOString().split('T')[0],
      // })

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: q_data,
      }

      const response = await axios.request(config)
      if (response.status === 201) {
        return response
      } else {
        return response
      }
    },

    async createQuotaAreaSpecies(request_data: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_QUOTAS_AREA_SPECIES_URL
      const data = JSON.stringify({
        quota_id: request_data.quota_id,
        species_objects: request_data.speciesObjects,
        quantity: request_data.quantity,
        area_id: request_data.area_id,
      })
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      }

      const response = await axios.request(config)
      if (response.status === 201) {
        return response
      } else {
        return response
      }
    },
    async updateQuota(quota: any) {
      const url =
        import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_QUOTAS_URL + '?quota_id=' + quota.id

      const data = JSON.stringify({
        name: quota.name,
        start_date: quota.start_date,
        end_date: quota.end_date,
      })

      const config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      }

      const response = await axios.request(config)

      if (response.status === 200) {
        return response
      } else {
        return response
      }
    },
    async deleteQuota(quota_id: any) {
      const url =
        import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_QUOTAS_URL + '?quota_id=' + quota_id
      const config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await axios.request(config)
      if (response.status === 204) {
        return response
      } else {
        return response
      }
    },

    // getquata area all specific quota

    async getAllSpeciesPerQuotaPerArea(quota_id: any, area_id: any, species_id: any) {
      console.log(quota_id, area_id, species_id)
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url:
          import.meta.env.VITE_APP_BASE_URL +
          import.meta.env.VITE_APP_SALES_QUOTAS_AREA_SPECIES_URL +
          '?quota_id=' +
          quota_id +
          '&area_id=' +
          area_id +
          '&species_id=' +
          species_id,
      }

      const response = await axios.request(config)
      return response
    },

    async getSpeciesList() {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SPECIES_URL,
      }
      const response = await axios.request(config)
      if (response.status === 200) {
        return response
      } else {
        return response
      }
    },

    async getAreaList() {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_HUTING_AREAS_URL,
      }

      const response = await axios.request(config)
      if (response.status === 200) {
        return response
      } else {
        return response
      }
    },
  },
})
