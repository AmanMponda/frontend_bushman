import { defineStore } from 'pinia'
import axios from 'axios'
// import { format } from 'date-fns'

export const usePriceListStore = defineStore('price-list', {
  state: () => {
    return {
      itemsByHuntingType: [] as any,
      priceList: [] as any,
      salesPackages: [] as any,
      packageOptions: [] as any,
      latestPackage: null as any,
      showModal: false,
      loadingpackages: false,
    }
  },

  actions: {
    async getPriceList(
      hunting_type_id: any = '',
      area_id: any = '',
      season_id: any = '',
      min_amount: any = '',
      max_amount: any = '',
    ) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_PRICE_LIST

      const params: any = {}
      if (hunting_type_id !== '' && hunting_type_id !== null && hunting_type_id !== undefined)
        params.hunting_type_id = hunting_type_id
      if (area_id !== '' && area_id !== null && area_id !== undefined) params.area_id = area_id
      if (season_id !== '' && season_id !== null && season_id !== undefined) params.season_id = season_id
      if (min_amount !== '' && min_amount !== null && min_amount !== undefined) params.min_amount = min_amount
      if (max_amount !== '' && max_amount !== null && max_amount !== undefined) params.max_amount = max_amount

      console.log('API URL:', url, 'params:', params)

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        params,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const response = await axios.request(config)
      console.log('API response data:', response.data)

      // Normalize response to always set an array on the store
      const raw = response.data
      const items = Array.isArray(raw) ? raw : raw?.data ?? []
      if (Array.isArray(items) && items.length > 0) {
        this.priceList = items
      } else {
        this.priceList = []
      }

      return response
    },
    async getPriceListByHuntingType(hunting_type_id: any = '', area_id: any = '', season_id: any = '') {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_PRICE_LIST

      const params: any = {}
      if (hunting_type_id !== '' && hunting_type_id !== null && hunting_type_id !== undefined)
        params.hunting_type_id = hunting_type_id
      if (area_id !== '' && area_id !== null && area_id !== undefined) params.area_id = area_id
      if (season_id !== '' && season_id !== null && season_id !== undefined) params.season_id = season_id

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        params,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await axios.request(config)

      const raw = response.data
      const items = Array.isArray(raw) ? raw : raw?.data ?? []
      this.itemsByHuntingType = items
      return response
    },

    async getPriceListById(id: any) {
      const url = `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_PRICE_LIST}${id}/`

      console.log('Fetching price list detail, URL:', url)

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const response = await axios.request(config)
      console.log('Price list detail response:', response.data)

      return response
    },

    async updatePriceList(id: number, payload: any) {
      const requestBody: any = {
        area: payload.area,
        hunting_type_id: payload.huntingTypeId,
        sales_package_ids: payload.sales_package_ids,
        description: payload.description,
        sales_quota_id: payload.salesQuotaId,
        amount: payload.amount,
        currency: payload.currency,
        duration: payload.duration,
        companion_days: payload.companionDays,
        companion_amount: payload.companionAmount,
        observer_days: payload.observerDays,
        observer_amount: payload.observerAmount,
        season_id: payload.season_id,
        start_date: payload.start_at,
        end_date: payload.end_at,
        is_active: payload.is_active,
        area_id: payload.area_id,
        user_id: payload.user_id,
        species_object_list: payload.speciesObjectList,
      }

      // Add upgrade_fees only if provided
      if (payload.upgrade_fees && payload.upgrade_fees.length > 0) {
        requestBody.upgrade_fees = payload.upgrade_fees
      }

      const data = JSON.stringify(requestBody)

      const config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_PRICE_LIST}${id}/`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      }

      const response = await axios.request(config)
      return response
    },

    async deletePriceList(id: number, force: boolean = false) {
      const url = `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_PRICE_LIST}${id}/${
        force ? '?force=true' : ''
      }`

      const config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const response = await axios.request(config)
      return response
    },

    async getSalesPackageList(usedAsOptions: boolean = false) {
      this.loadingpackages = true
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_PACKAGE_VSET_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const response = await axios.request(config)
      if (response.status === 200) {
        this.loadingpackages = false
        if (!usedAsOptions) {
          this.salesPackages = response.data.map((item: any) => {
            return {
              id: item.id,
              name: item.name,
              area_name: item?.area?.name ?? 'N/A',
              regulatory_package_name: item?.regulatory_package?.name ?? 'N/A',
              selfItem: item,
            }
          })
        } else {
          this.latestPackage = {
            value: response.data[0].id,
            text: response.data[0].name,
          }

          this.packageOptions = response.data.map((item: { id: any; name: any }) => {
            return {
              value: item.id,
              text: item.name,
            }
          })
        }
      }
      return response
    },

    async createSalesPackage(payload: any) {
      const data = JSON.stringify({
        name: payload.name,
        area_id: payload.areaId,
        regulatory_package_id: payload.licenceId,
        description: payload.description,
        species_object_list: payload.speciesObjectList,
      })

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_PACKAGE_VSET_URL,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      }

      const response = await axios.request(config)
      if (response.status === 201) {
        this.showModal = false
        this.getSalesPackageList()
      }
      return response
    },

    async updateSalesPackage(id: number, payload: any) {
      const data = JSON.stringify({
        name: payload.name,
        area_id: payload.areaId,
        regulatory_package_id: payload.licenceId,
        description: payload.description,
        species_object_list: payload.speciesObjectList,
      })

      const config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_PACKAGE_VSET_URL + id + '/',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      }

      const response = await axios.request(config)
      if (response.status === 200) {
        this.getSalesPackageList()
      }
      return response
    },

    async deleteSalesPackage(id: number, force: boolean = false) {
      const url =
        import.meta.env.VITE_APP_BASE_URL +
        import.meta.env.VITE_APP_SALES_PACKAGE_VSET_URL +
        id +
        '/' +
        (force ? '?force=true' : '')

      const config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const response = await axios.request(config)
      if (response.status === 200 || response.status === 204) {
        this.getSalesPackageList()
      }
      return response
    },

    async createPriceList(payload: any) {
      // const startDate = payload?.startDate ? format(new Date(payload.startDate), 'yyyy-MM-dd') : null
      // const endDate = payload?.endDate ? format(new Date(payload.endDate), 'yyyy-MM-dd') : null
      const requestBody: any = {
        area: payload.area,
        hunting_type_id: payload.huntingTypeId,
        sales_package_ids: payload.sales_package_ids,
        description: payload.description,
        sales_quota_id: payload.salesQuotaId,
        amount: payload.amount,
        currency: payload.currency,
        duration: payload.duration,
        companion_days: payload.companionDays,
        companion_amount: payload.companionAmount,
        observer_days: payload.observerDays,
        observer_amount: payload.observerAmount,
        season_id: payload.season_id,
        start_date: payload.start_at,
        end_date: payload.end_at,
        is_active: payload.is_active,
        area_id: payload.area_id,
        user_id: payload.user_id,
        species_object_list: payload.speciesObjectList,
      }

      // Add upgrade_fees only if provided
      if (payload.upgrade_fees && payload.upgrade_fees.length > 0) {
        requestBody.upgrade_fees = payload.upgrade_fees
      }

      const data = JSON.stringify(requestBody)

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_CREATE_PRICE_LIST,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      }

      const response = await axios.request(config)
      return response
    },

    async getCompletePriceListPdf(
      hunting_type_id: any = '',
      area_id: any = '',
      season_id: any = '',
      min_amount: any = '',
      max_amount: any = '',
    ) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_PRICE_LIST

      const params: any = {}
      if (hunting_type_id !== '' && hunting_type_id !== null && hunting_type_id !== undefined)
        params.hunting_type_id = hunting_type_id
      if (area_id !== '' && area_id !== null && area_id !== undefined) params.area_id = area_id
      if (season_id !== '' && season_id !== null && season_id !== undefined) params.season_id = season_id
      if (min_amount !== '' && min_amount !== null && min_amount !== undefined) params.min_amount = min_amount
      if (max_amount !== '' && max_amount !== null && max_amount !== undefined) params.max_amount = max_amount

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        params,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const response = await axios.request(config)
      return response
    },
  },
})
