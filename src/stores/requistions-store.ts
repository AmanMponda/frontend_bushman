import { defineStore } from 'pinia'
import axios from 'axios'
import { formatDate } from 'date-fns'
import { requestStatus } from '../utils/requistion_status'

export const useRequisitionStore = defineStore('requisition-store', {
  state: () => {
    return {
      requisitions: [] as any,
      requistionItems: [] as any,
      loadingRequisitions: false,
      loadingRequistionItems: false,
      showApprovalModal: false,
    }
  },

  actions: {
    async getRequisitions() {
      this.loadingRequisitions = true

      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_REQUISITION_VSET_URL

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
        this.loadingRequisitions = false
        this.requisitions = response.data.map((requisition: any) => {
          return {
            status: requestStatus(requisition),
            requested_at: formatDate(requisition.date, 'MMM dd yyyy'),
            required_date: formatDate(requisition.required_date, 'MMM dd yyyy'),
            requested_by:
              requisition.requested_by.first_name === '' && requisition.requested_by.last_name === ''
                ? requisition.requested_by.username
                : requisition.requested_by.first_name + '' + requisition.requested_by.last_name,
            type: requisition.type,
            selfItem: requisition,
            main_status: requisition.status,
          }
        })
      }

      return response
    },

    async getRequistionItems(id: any) {
      this.loadingRequistionItems = true
      const url =
        import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_REQUISITION_ITEM_VSET_URL + `?requisition_id=${id}`
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
        this.loadingRequistionItems = false
        this.requistionItems = response.data.map((item: any) => {
          return {
            item_name: item.name,
            accounts: item.accounts,
            items: item.items,
          }
        })
      }
      return response.data
    },

    // create requisition
    //localhost:8000/api/v1.0/requisition/requisition-vset/
    async createRequisition(payload: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_REQUISITION_VSET_URL
      const data = JSON.stringify({
        approval_chain_module_id: payload.approval_chain_module_id,
        type: payload.type,
        level_id: payload.level_id,
        date: formatDate(new Date(), 'yyyy-MM-dd'),
        required_date: formatDate(new Date(), 'yyyy-MM-dd'),
        remarks: payload.remarks,
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

    async updateRequisitionStatus(payload: any) {
      const data = JSON.stringify({
        requisition_id: payload.requisition_id,
        level_id: payload.level_id,
        remarks: payload.remarks,
        status: payload.status,
      })

      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_REQUISITION_VSET_URL
      const config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      }

      const response = await axios.request(config)
      if (response.status === 200) {
        this.showApprovalModal = false
        this.getRequisitions()
      }

      return response
    },

    async createRequisitionItem(payload: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_REQUISITION_ITEM_VSET_URL
      const data = JSON.stringify({
        requisition_id: payload.requisition_id,
        source_type: payload.source_type,
        currency_id: payload.currency_id,
        account_id: payload.account_id,
        mode_of_payment_id: payload.mode_of_payment_id,
        remarks: payload.remarks,
        item_name: payload.item_name,
        items: payload.items,
        amount: payload.amount,
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
  },
})
