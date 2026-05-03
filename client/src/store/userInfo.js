import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    token: '',
    id: '',
    username: '',
    role: 0,
    real_name: '',
    avatar: '',
    major: '',
    degree: '',
    university: '',
  }),
  actions: {
    updateInfo(info) {
      Object.assign(this, info)
    },
    updateToken(token) {
      this.token = token
    },
    clearInfo() {
      this.$reset()
    }
  },
  persist: true
})
