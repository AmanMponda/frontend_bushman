// VITE_APP_SALES_CONFIRMATION_CONTRACT_VSET_URL

import { defineStore } from 'pinia'
import axios from 'axios'
import { format } from 'date-fns'
import { formatDateTime } from '../services/utils'

export const useGameStore = defineStore('sales_game', {
  state: () => {
    return {
      games: [] as any,
      loadinggames: false,
      permits: [] as any,
      loadingPermits: false,
      activities: [] as any,
      loadingActivities: false,
    }
  },

  actions: {
    async getRegisteredGames() {
      this.loadinggames = true
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_GAME_ACTIVITY_VSET_URL

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
          this.games = response.data.map((item: any) => {
            return {
              permit_number: item?.entity_contract_permit?.permit_number ?? '',
              client_name: item?.client.full_name,
              status: item.status,
              pdf: item.pdf,
              selfitem: item,
              start_date: formatDateTime(item?.start_date),
              end_date: formatDateTime(item.end_date),
            }
          })
          this.loadinggames = false
          return response
        }
        console.log(this.games)
        return response
      } catch (error) {
        this.loadinggames = false
      }
    },

    async initiateGameActivity(payload: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_CREATE_GAME_ACTIVITY_VSET_URL
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
      return response
    },

    // create Game Activity
    async iniateandOrSaveGameActivity(payload: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_GAME_ACTIVITY_REGISTRATION_VSET_URL
      const data = JSON.stringify({
        entity_contract_permit_id: payload.entity_contract_permit_id,
        client_id: payload.client_id,
        start_date:
          payload.start_date != null || payload.start_date != undefined
            ? format(payload.start_date, 'yyyy-MM-dd')
            : null,
        end_date:
          payload.end_date != null || payload.end_date != undefined ? format(payload.end_date, 'yyyy-MM-dd') : null,
        professional_hunters_ids: payload.professional_hunters_ids,
        coordinates_type: 'Point',
        coordinates: payload.coordinates,
        species_id: payload.species_id,
        quantity: payload.quantity ?? 1,
        area_id: payload.area_id,
        time: payload.time,
        date: payload.date,
        weapon_used: payload.weapon_used,
        description: payload.description,
        spacies_gender: payload.gender,
        status: payload.status,
        sales_confirmation_proposal_id: payload.sales_confirmation_proposal_id,
        game_state: payload.game_state,
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

    async getActiviteActivites(activity_id: any) {
      this.loadingActivities = true
      const url =
        import.meta.env.VITE_APP_BASE_URL +
        import.meta.env.VITE_APP_GAME_ACTIVITIES_VSET_URL +
        '?game_activity_id=' +
        activity_id
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
          this.loadingActivities = false

          this.activities = response.data.map((activity: any) => {
            return {
              species: activity.species.name,
              quantity: activity.quantity,
              area: activity.area.name,
              weapon_used: activity.weapon_used,
              date: formatDateTime(activity.date),
              time: activity.time,
              gender: activity.spacies_gender,
              coordinates: ` ${activity.location.geo_coordinates.coordinates[0].lat}, ${activity.location.geo_coordinates.coordinates[0].lng} `,
              status: activity.status,
            }
          })

          return response
        }
      } catch (error) {
        this.loadingActivities = false
        console.log(error)
      }
    },

    async createASingleActivity(payload: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_GAME_ACTIVITIES_VSET_URL
      const data = JSON.stringify({
        game_activity_id: payload.game_activity_id,

        coordinates_type: 'Point',
        coordinates: [
          {
            lat: payload.lat,
            lng: payload.lng,
          },
        ],
        area_id: payload.area_id,
        time: payload.time,
        date: format(payload.date, 'yyyy-MM-dd'),
        weapon_used: payload.weapon_used,
        species_id: payload.species_id,
        quantity: payload.quantity ?? 1,
        description: payload.description,
        spacies_gender: payload.gender,
        status: payload.status,
        sales_confirmation_proposal_id: payload.sales_confirmation_proposal_id,
        game_state: payload.game_state,
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
