import { defineStore } from 'pinia'
import axios from 'axios'

export const useSettingsStore = defineStore('settings-store', {
  state: () => {
    return {
      itemsByHuntingType: [] as any,
      logo: '',
      licenceAreaSpecies: [] as any,
      laodinglicenceAreaSpecies: false,
      salesPackagesSpecies: [] as any,
      salesPackages: [] as any,
      loadingSalesPackages: false,
      currencies: [] as any,
      units: [] as any,
      safariExtras: [] as any,
      showCreateSafariExtraModal: false,
      savingSafariExtra: false,
      loadingExtras: false,
      salesInquiryEntities: [] as any,
      accommodationTypes: [] as any,

      // seasons
      seasons: [] as any,

      // accommodationType vars
      loadingAccommodationTypes: false,
      loadingSalesInquiryEntities: false,
      showAccommodationTypeModal: false,
      savingAccommodationType: false,

      // sales charters price list
      salesChartersPriceList: [] as any,
      loadingSalesChartersPriceList: false,
      savingSalesChartersPriceList: false,
      showSalesChartersPriceListModal: false,
    }
  },

  actions: {
    async getHuntingsTypes() {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_HUNTING_TYPES_URL

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

    // VITE_APP_CURRENCIES_URL
    async getCurrencies() {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_CURRENCIES_URL

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
        this.currencies = response.data.map((item: any) => {
          return {
            value: item.id,
            text: item.name,
            currency: item.currency,
            price: item.price,
          }
        })
      }
      return response
    },
    // VITE_APP_SEASONS_URL
    async getSeasons(isUsedAsOption: boolean = false) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SEASONS_URL

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
        if (isUsedAsOption) {
          this.seasons = response.data.map((item: any) => {
            return {
              value: item.id,
              text: item.name,
            }
          })
        } else {
          this.seasons = response.data
        }
      }

      return response
    },

    loadLogo() {
      // Fetch the logo image and convert to base64
      const img = new Image()
      img.src = '/logo.png' // Your logo image path
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx: any = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const dataURL = canvas.toDataURL('image/png') // Convert to base64
        this.logo = dataURL // Assign the base64 string to logo
      }
    },

    // get doc types
    async getDocTypes() {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_DOC_TYPES_URL

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

    async getLicenceRegulatoryHuntingPackageSpecies(payload: any) {
      const url =
        import.meta.env.VITE_APP_BASE_URL +
        import.meta.env.VITE_APP_LICENCE_REGULATORY_HUNTING_PACKAGE_SPECIES_URL +
        `?quota_id=${payload.quotaId}`

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

    // get ph
    // VITE_APP_PH_VSET_URL
    async getPhVset() {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_PH_VSET_URL
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

    async getHuntingLicenseAreaSpecies(payload: any) {
      this.laodinglicenceAreaSpecies = true
      this.licenceAreaSpecies = []
      const url =
        import.meta.env.VITE_APP_BASE_URL +
        import.meta.env.VITE_APP_LICENCE_AREA_SPECIES_URL +
        `?area_id=${payload.areaId}&licence_id=${payload.licenceId}`
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await axios.request(config)
      if (response.data.length > 0) {
        this.laodinglicenceAreaSpecies = false
        this.licenceAreaSpecies = response.data.map((item: any) => {
          return {
            id: item.species.id,
            name: item.species.name,
            scientific_name: item.species.scientific_name,
            quantity: item.quantity,
          }
        })
      }

      return response
    },

    async getSalespackagesSpecies(payload: any) {
      this.loadingSalesPackages = true
      const url =
        import.meta.env.VITE_APP_BASE_URL +
        import.meta.env.VITE_APP_SALES_PACKAGE_SPECIES_URL +
        `?sales_package_id=${payload.salespackageId}`
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
        this.salesPackagesSpecies = response.data.map((item: any) => {
          return {
            id: item.species.id,
            name: item.species.name,
            species_id: item.species.id,
            scientific_name: item.species.scientific_name,
            quantity: item.quantity,
          }
        })
        this.loadingSalesPackages = false
      }
      return response
    },
    async getUnits() {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_UNITS_URL
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
        this.units = response.data.map((item: any) => {
          return {
            value: item.id,
            text: item.name,
            unit: item.unit,
            factor: item.factor,
          }
        })
      }
      return response
    },
    // VITE_APP_SAFARY_EXTRAS_VSET_URL
    async getSafariExtras(isUsedAsOption: boolean) {
      this.loadingExtras = true
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SAFARY_EXTRAS_VSET_URL
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      try {
        const response = await axios.request(config)

        if (response.status === 200) {
          this.loadingExtras = false
          if (!isUsedAsOption) {
            this.safariExtras = response.data.map((item: any) => {
              return {
                id: item.id,
                name: item.name,
                amount: `${item.currency.symbol} ${item.amount} `,
                description: item.description,
              }
            })
          } else {
            this.safariExtras = response.data.map((item: any) => {
              return {
                value: item.id,
                text: item.name,
              }
            })
          }
        }
        return response
      } catch (error) {
        this.loadingExtras = false
      }
    },

    async createSafariExtras(payload: any) {
      this.savingSafariExtra = true
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SAFARY_EXTRAS_VSET_URL
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: payload,
      }

      const response = await axios.request(config)
      if (response.status === 201) {
        this.savingSafariExtra = false
        this.showCreateSafariExtraModal = false
        this.getSafariExtras(false)
      }
      return response
    },

    // # http://localhost:8000/api/v1.0/settings/sales-inquiry-entity/?sales_inquiry_id=59
    // VITE_APP_SALES_INQUIRY_ENTITY_URL=settings/sales-inquiry-entity/
    async getSalesInquiryEntities(salesInquiryId: any) {
      const url =
        import.meta.env.VITE_APP_BASE_URL +
        import.meta.env.VITE_APP_SALES_INQUIRY_ENTITY_URL +
        `?sales_inquiry_id=${salesInquiryId}`
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
        this.salesInquiryEntities = response.data.map((item: any) => {
          return {
            value: item.id,
            text: item.full_name,
          }
        })
      }
    },
    // VITE_APP_ACCOMMODATION_TYPES_URL=settings/accommodation-types/
    // get
    async getAccommodationTypes(isUsedAsOption: boolean) {
      this.loadingAccommodationTypes = true
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_ACCOMMODATION_TYPES_URL
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
        this.loadingAccommodationTypes = false
        if (!isUsedAsOption) {
          this.accommodationTypes = response.data.map((item: any) => {
            return {
              id: item.id,
              name: item.name,
              description: item.description,
            }
          })
        } else {
          this.accommodationTypes = response.data.map((item: any) => {
            return {
              value: item.id,
              text: item.name,
            }
          })
        }
      }
      return response
    },

    // create
    async createAccommodationType(payload: any) {
      this.savingAccommodationType = true
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_ACCOMMODATION_TYPES_URL
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: payload,
      }

      const response = await axios.request(config)
      if (response.status === 201) {
        this.savingAccommodationType = false
        this.showAccommodationTypeModal = false
        this.getAccommodationTypes(true)
      }
      return response
    },

    async getSalesChartersPriceList(isUsedAsOption: boolean) {
      this.loadingSalesChartersPriceList = true
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_CHARTERS_PRICE_LIST_URL
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await axios.request(config)
      try {
        if (response.status === 200) {
          this.loadingSalesChartersPriceList = false
          if (!isUsedAsOption) {
            this.salesChartersPriceList = response.data.map((item: any) => {
              return {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
              }
            })
          } else {
            this.salesChartersPriceList = response.data.map((item: any) => {
              return {
                value: item.id,
                text: item.name,
              }
            })
          }
        }
      } catch (error) {
        this.loadingSalesChartersPriceList = false
        console.log(error)
      }
    },

    // create
    async createSalesChartersPriceList(payload: any) {
      this.savingSalesChartersPriceList = true
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_CHARTERS_PRICE_LIST_URL
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: payload,
      }

      const response = await axios.request(config)
      if (response.status === 201) {
        this.savingSalesChartersPriceList = false
        this.showSalesChartersPriceListModal = false
        this.getSalesChartersPriceList(true)
      }
      return response
    },
  },
})
