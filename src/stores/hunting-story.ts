import { defineStore } from 'pinia'
import axios from 'axios'

export const useHuntingAreaStore = defineStore('hunting-area-store', {
  state: () => {
    return {}
  },

  actions: {
    async createHuntingArea(payload: any) {
      const data = JSON.stringify({
        name: payload.name,
        description: payload.description,
        coordinates_type: 'Point',
        coordinates: payload.coordinates,
        is_disabled: false,
      })

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_HUTING_AREAS_URL,
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
