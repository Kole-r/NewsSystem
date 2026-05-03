import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    isRouterAdded: false
  }),
  actions: {
    setRouterAdded(val) {
      this.isRouterAdded = val
    }
  }
})
