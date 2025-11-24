import { defineStore } from 'pinia'
import axios from 'axios'
import { format } from 'date-fns'
import { formatDateTime } from '../services/utils'

export const useSalesInquiriesStore = defineStore('sales_inquiries', {
  state: () => {
    return {
      salesInquiries: [] as any,
      results: [] as any,
      loadingresults: false,
      priceBreakDown: null as any,
      addCompanions: false,
      observers: [] as any,
      showObserversModal: false,
      showCompanionsModal: false,
      companions: [] as any,
      savingSafariExtras: false,
      clientSafariExtras: [] as any,
      showSafariExtrasModal: false,
      showAccommodationModal: false,
      accommodations: [] as any,
      // charterPrices: [] as any,
      chartersPrices: [] as any,
      showChartersPriceModal: false,
      savingCharterPrices: false,
      loadingCharterPrices: false,
    }
  },

  actions: {
    async getSalesInquiries(seasonId: any, preferredDate: any) {
      const formattedDate = preferredDate ? format(new Date(preferredDate), 'yyyy-MM-dd') : ''

      const url =
        import.meta.env.VITE_APP_BASE_URL +
        import.meta.env.VITE_APP_SALES_INQUIRIES_URL +
        '?season_id=' +
        seasonId +
        '&preferred_date=' +
        formattedDate

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

    async createSalesInquiry(payload: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_INQUIRIES_URL
      const formattedDate = payload?.preferredDate ? format(new Date(payload.preferredDate), 'yyyy-MM-dd') : null
      const start_date = payload.startDate ? format(new Date(payload.startDate), 'yyyy-MM-dd') : null
      const end_date = payload.endDate ? format(new Date(payload.endDate), 'yyyy-MM-dd') : null
      const data = JSON.stringify({
        categories: 'Hunter',
        full_name: payload?.fullName,
        contacts: payload?.contacts,
        nationality: payload?.nationality,
        country: payload?.country,
        price_list_id: payload?.priceListId,
        no_of_hunters: payload?.noOfHunters,
        no_of_days: payload?.noOfDays,
        no_of_companions: payload?.noOfCompanions,
        no_of_observers: payload?.noOfObservers,
        preferred_species: payload?.species,
        area_id: payload?.areaId,
        season: payload?.season.value,
        preferred_date: formattedDate,
        start_date: start_date,
        end_date: end_date,
        identity_number: payload?.identityNumber,
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
      return response
    },

    async getallSalesConfirmation() {
      this.loadingresults = true
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_CONFIRMATION_VSET_URL

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
        if (response.data.length > 0 && response.status === 200) {
          this.loadingresults = false
          this.results = response.data.map((item: any) => {
            return {
              // code: item.sales_inquiry.code,
              name: item?.sales_inquiry?.entity?.full_name,
              area: item?.sales_inquiry?.area[0]?.area?.name,
              airport_name: item?.itinerary?.airport_name,
              charter_in: formatDateTime(item.itinerary.charter_in),
              charter_out: formatDateTime(item.itinerary.charter_out),
              arrival: formatDateTime(item.itinerary.arrival),
              status: item?.status?.status ?? 'No Status',
              selfitem: item,
            }
          })
          return response
        } else {
          this.loadingresults = false
          this.results = []
          return response
        }
      } catch (error) {
        console.log(error)
        this.loadingresults = false
        this.results = []
        return error
      }
    },

    async createSalesConfirmationFinalization(payload: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_CONFIRMATION_VSET_URL
      const data = JSON.stringify({
        sales_inquiry_id: payload.salesInquiryId,
        package_id: payload.packageId,
        airport_name: payload.airportName,
        charter_in: payload.charterIn,
        charter_out: payload.charterOut,
        arrival: payload.arrival,
        installments: payload.installments,
        regulatory_package_id: payload.regulatoryPackageId,
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
      return response
    },

    async getSalesPriceBreakdown(payload: any) {
      //     # http://localhost:8000/api/v1.0/sales-confirmation/total-sales-amount/?package_id=1&sales_inquiry_id=1
      // VITE_APP_SALESPRICE_BREAK_DOWN_URL=sales-confirmation/total-sales-amount/
      const url =
        import.meta.env.VITE_APP_BASE_URL +
        import.meta.env.VITE_APP_SALESPRICE_BREAK_DOWN_URL +
        '?package_id=' +
        payload.packageId +
        '&sales_inquiry_id=' +
        payload.salesInquiryId
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
        this.priceBreakDown = response.data
        return response
      } catch (error) {
        console.log(error)
        return error
      }
    },

    async updatesalesConfirmationStatus(payload: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_CONFIRMATION_STATUS_VSET_URL
      const data = new FormData()

      data.append('doc_type_id', payload.docTypeId)
      data.append('entity_id', payload.entityId)
      // data.append('documents', JSON.stringify(payload.documents))
      data.append('contract_doc', payload.contractDoc)
      data.append('payment_doc', payload.paymentDoc)
      data.append('sales_confirmation_proposal_id', payload.salesConfirmationProposalId)
      data.append('status_id', payload.statusId)
      data.append('area_id', payload.areaId)
      data.append('quota_id', payload.quotaId)

      const config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: data,
      }

      const response = await axios.request(config)
      return response
    },

    // # http://localhost:8000/api/v1.0/sales-confirmation/sales-confirmation-proposal-observers-vset/?entity_id=44&sales_confirmation_id=27
    // VITE_APP_SALES_CONFIRMATION_PROPOSAL_OBSERVERS_VSET_URL=sales-confirmation/sales-confirmation-proposal-observers-vset/
    async createSalesConfirmationProposalObservers(payload: any) {
      const url =
        import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_CONFIRMATION_PROPOSAL_OBSERVERS_VSET_URL
      // [
      //   {
      //     contact_type: 'email',
      //     contact: 'john.doe@example.com',
      //   },
      //   {
      //     contact_type: 'phone',
      //     contact: '+1234567890',
      //   },
      // ],
      const request_data = {
        full_name: payload.fullName,
        nationality_id: payload.nationalityId,
        country_id: payload.countryId,
        identity_number: payload.identityNumber,
        sales_inquiry_id: payload.salesInquiryId,
        contacts: payload.contacts,
        charter_in: payload.charter_in,
        charter_out: payload.charter_out,
        arrival_airport: payload.arrival_airport,
      }

      const json_data = JSON.stringify(request_data)
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: json_data,
      }

      const response = await axios.request(config)

      if (response.status === 201) {
        this.addCompanions = true
        this.showObserversModal = false
      }
      return response
    },
    async getObservers(salesInquiryId: any) {
      const url =
        import.meta.env.VITE_APP_BASE_URL +
        import.meta.env.VITE_APP_SALES_CONFIRMATION_PROPOSAL_OBSERVERS_VSET_URL +
        '?sales_inquiry_id=' +
        salesInquiryId

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
          this.observers = response.data.map((item: any) => {
            return {
              id: item.id,
              full_name: item.observer.full_name,
              nationality: item.observer.nationality.name,
            }
          })
          return response
        } else {
          return response
        }
      } catch (error) {
        console.log(error)
        return error
      }
    },

    // # http://localhost:8000/api/v1.0/sales-confirmation/sales-confirmation-companion-vset/?entity_id=42&sales_confirmation_id=27
    // VITE_APP_SALES_CONFIRMATION_COMPANION_VSET_URL=sales-confirmation/sales-confirmation-companion-vset/
    async createSalesConfirmationCompanion(payload: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_CONFIRMATION_COMPANION_VSET_URL
      const request_data = {
        full_name: payload.fullName,
        nationality_id: payload.nationalityId,
        country_id: payload.countryId,
        identity_number: payload.identityNumber,
        sales_inquiry_id: payload.salesInquiryId,
        regulatory_package_id: payload.regulatoryPackageId,
        contacts: payload.contacts,
        charter_in: payload.charter_in,
        arrival_airport: payload.arrival_airport,

        charter_out: payload.charter_out,
      }

      const json_data = JSON.stringify(request_data)
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: json_data,
      }

      const response = await axios.request(config)

      if (response.status === 201) {
        this.addCompanions = true
        this.showCompanionsModal = false
      }
      return response
    },

    async getCompanions(salesInquiryId: any, usedOptionsList: boolean = false) {
      const url =
        import.meta.env.VITE_APP_BASE_URL +
        import.meta.env.VITE_APP_SALES_CONFIRMATION_COMPANION_VSET_URL +
        '?sales_inquiry_id=' +
        salesInquiryId
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
        if (usedOptionsList === false)
          if (response.status === 200) {
            this.companions = response.data.map((item: any) => {
              return {
                id: item.id,
                full_name: item.companion.full_name,
                nationality: item.companion.nationality.name,
              }
            })
            return response
          } else {
            return response
          }
        else {
          this.companions = response.data.map((item: any) => {
            return {
              text: item.companion.full_name,
              value: item.companion.id,
            }
          })
          return response
        }
      } catch (error) {
        console.log(error)
        return error
      }
    },

    async createsafariExtras(payload: any) {
      this.savingSafariExtras = true
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_CLIENT_SAFARI_EXTRAS_VSET_URL
      const data = JSON.stringify({
        safary_extras: payload,
      })

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        data: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await axios.request(config)
      if (response.status === 201) {
        this.showSafariExtrasModal = false
        this.savingSafariExtras = false
        return response
      } else {
        this.savingSafariExtras = false
        return response
      }
      return response
    },

    async getClienSafariExtras(salesInquiryId: any) {
      const url =
        import.meta.env.VITE_APP_BASE_URL +
        import.meta.env.VITE_APP_CLIENT_SAFARI_EXTRAS_VSET_URL +
        '?sales_inquiry_id=' +
        salesInquiryId
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      this.clientSafariExtras = []

      const response = await axios.request(config)

      if (response.status === 200) {
        this.clientSafariExtras = response?.data?.map((item: any) => {
          return {
            name: item.safari_extras.name,
            amount: `${item.safari_extras.currency.symbol} ${item.safari_extras.amount}`,
          }
        })
      }
      return response
    },

    async getAccommodation(salesInquiryId: any) {
      const url =
        import.meta.env.VITE_APP_BASE_URL +
        import.meta.env.VITE_APP_SALES_CONFIRMATION_ACCOMMODATION_VSET_URL +
        '?sales_inquiry_id=' +
        salesInquiryId
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
        this.accommodations = response.data.map((item: any) => {
          return {
            id: item.id,
            name: item.entity.full_name,
            type_name: item.type.name,
            check_in: formatDateTime(item.check_in),
            check_out: formatDateTime(item.check_out),
          }
        })
      }
      return response
    },

    async createAccommodation(payload: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_CONFIRMATION_ACCOMMODATION_VSET_URL
      const data = JSON.stringify(payload)

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
        this.showAccommodationModal = false
        this.getAccommodation(payload.sales_inquiry_id)
        return response
      } else {
        return response
      }
    },

    // VITE_APP_SALES_CHARTERS_PRICE_VSET_URL
    async getChartersPrice(salesInquiryId: any) {
      const url =
        import.meta.env.VITE_APP_BASE_URL +
        import.meta.env.VITE_APP_SALES_CHARTERS_PRICE_VSET_URL +
        '?sales_inquiry_id=' +
        salesInquiryId

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
        this.chartersPrices = response.data.map((item: any) => {
          return {
            id: item.id,
            name: item.charters_price_list.name,
            amount: `${item?.charters_price_list?.currency?.symbol} ${item?.charters_price_list?.amount}`,
          }
        })
      }
    },
    // create
    async createChartersPrice(payload: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_CHARTERS_PRICE_VSET_URL
      const data = JSON.stringify(payload)

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
        this.showChartersPriceModal = false
        this.getChartersPrice(payload.sales_inquiry_id)
        return response
      } else {
        return response
      }
    },
  },
})
