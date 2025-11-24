// VITE_APP_SALES_CONFIRMATION_CONTRACT_VSET_URL

import { defineStore } from 'pinia'
import axios from 'axios'
import { format } from 'date-fns'
import { formatDateTime } from '../services/utils'

export const useContractsStore = defineStore('sales_contracts', {
  state: () => {
    return {
      contracts: [] as any,
      loadingContracts: false,
      permits: [] as any,
      loadingPermits: false,
    }
  },

  actions: {
    async getContracts(contractorType: string = 'MAIN_HUNTER') {
      this.loadingContracts = true
      const url =
        import.meta.env.VITE_APP_BASE_URL +
        import.meta.env.VITE_APP_SALES_CONFIRMATION_CONTRACT_VSET_URL +
        '?contractor_type=' +
        contractorType

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
          this.contracts = response.data.map((contract: any) => {
            return {
              contract_number: contract.contract_number,
              start_date: formatDateTime(contract.start_date),
              end_date: formatDateTime(contract.end_date),
              created_at: formatDateTime(contract.created_at),
              client_name: contract?.sales_confirmation_proposal?.sales_inquiry?.entity?.full_name,
              pdf: contract.pdf,
              selfitem: contract,
            }
          })
          this.loadingContracts = false
          return response
        }
        console.log(this.contracts)
        return response
      } catch (error) {
        this.loadingContracts = false
        console.log(error)
        return error
      }
    },

    async getContractPermits() {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_ENTITY_CONTRACT_PERMIT_VSET_URL
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
        this.permits = response.data.map((permit: any) => {
          return {
            permit_number: permit.permit_number,
            issued_date: formatDateTime(permit.issued_date),
            description: permit.description,
            start_date: formatDateTime(permit.dates[0].start_date),
            expiry_date: formatDateTime(permit.dates[0].end_date),
            updated_at: formatDateTime(permit.updated_at),
            entity_contract_id: permit.entity_contract_id,
            package_type: permit.package_type,
            pdf: permit.pdf,
            selfitem: permit,
          }
        })

        this.loadingPermits = false
        return response
      }
    },

    async createPermit(payload: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_ENTITY_CONTRACT_PERMIT_VSET_URL
      const data = JSON.stringify({
        entity_contract_id: payload.entity_contract_id,
        permit_number: payload.permit_number,
        issued_date: format(payload.issued_date, 'yyyy-MM-dd'),
        package_type: payload.package_type,
        description: payload.description,
        start_date: format(payload.start_date, 'yyyy-MM-dd'),
        end_date: format(payload.end_date, 'yyyy-MM-dd'),
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

    async createContract(payload: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_CONFIRMATION_CONTRACT_VSET_URL

      const data = JSON.stringify({
        sales_confirmation_proposal_id: payload.sales_confirmation_proposal_id,
        entity_id: payload.entity_id,
        start_date: format(payload.start_date, 'yyyy-MM-dd'),
        contractor_type: payload.contractor_type,
        end_date: format(payload.end_date, 'yyyy-MM-dd'),
        description: 'Updated contract description.',
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
