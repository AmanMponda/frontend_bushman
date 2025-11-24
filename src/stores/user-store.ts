import axios from 'axios'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userName: 'Vasili Savitski',
      email: 'vasili@gmail.com',
      memberSince: '8/12/2020',
      pfp: 'https://picsum.photos/id/22/200/300',
      is2FAEnabled: false,
      users: [] as any[],
    }
  },

  actions: {
    toggle2FA() {
      this.is2FAEnabled = !this.is2FAEnabled
    },

    changeUserName(userName: string) {
      this.userName = userName
    },

    async getUsers() {
      // VITE_APP_USERS_URL

      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_USERS_URL

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
        this.users = response.data.map((user: any) => {
          return {
            value: user.id,
            text: user.first_name && user.last_name ? user.first_name + '' + user.last_name : user.username,
          }
        })
      }
    },
  },
})
