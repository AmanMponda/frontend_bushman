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
      // Use new endpoint: api/v1.0/contracts
      const url =
        import.meta.env.VITE_APP_BASE_URL + 'contracts' + (contractorType ? `?contractor_type=${contractorType}` : '')

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
          // Handle paginated response: {current_page: 1, data: [...]}
          let contractsData = []
          if (response.data.data && Array.isArray(response.data.data)) {
            contractsData = response.data.data
          } else if (Array.isArray(response.data)) {
            contractsData = response.data
          } else if (response.data.value && Array.isArray(response.data.value)) {
            contractsData = response.data.value
          }

          this.contracts = contractsData.map((contract: any) => {
            // Extract client name from entity or sales_confirmation_proposal
            const clientName =
              contract.entity?.full_name ||
              contract.sales_confirmation_proposal?.client?.full_name ||
              contract.client_name ||
              'Unknown Client'

            return {
              id: contract.id,
              contract_number: contract.contract_number,
              start_date: formatDateTime(contract.start_date),
              end_date: formatDateTime(contract.end_date),
              created_at: formatDateTime(contract.created_at),
              updated_at: formatDateTime(contract.updated_at),
              description: contract.description,
              sales_confirmation_proposal_id: contract.sales_confirmation_proposal_id,
              entity_id: contract.entity_id,
              contractor_type: contract.contractor_type,
              client_name: clientName,
              pdf: contract.pdf,
              // Include full nested data
              entity: contract.entity,
              sales_confirmation_proposal: contract.sales_confirmation_proposal,
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

      // Backend automatically gets start_date and end_date from sales inquiry preferences
      // Include contractor_type as null to satisfy backend validation
      const contractData = {
        sales_confirmation_proposal_id: payload.sales_confirmation_proposal_id,
        entity_id: payload.entity_id || null,
        contractor_type: null,
        description: payload.description || '',
      }

      console.log('Creating contract with payload:', contractData)

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(contractData),
      }

      try {
        const response = await axios.request(config)
        return response
      } catch (error: any) {
        console.error('Contract creation error:', error.response?.data)
        throw error
      }
    },

    async deleteContractById(contractId: number) {
      // Use the correct DELETE endpoint: sales-confirmation/contracts/{id}/
      const url = import.meta.env.VITE_APP_BASE_URL + 'sales-confirmation/contracts/' + contractId + '/'

      console.log('Attempting to delete contract at URL:', url)

      const config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      try {
        const response = await axios.request(config)
        console.log('Contract deleted successfully:', response)
        return response
      } catch (error: any) {
        console.error('Contract deletion error - Status:', error.response?.status)
        console.error('Contract deletion error - Data:', error.response?.data)
        console.error('Contract deletion error - Full error:', error)
        throw error
      }
    },
  },
})
