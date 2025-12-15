import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
    state: () => ({
        isGettingRouter: false, // 初始状态为 false
    }),
    actions: {
        setGettingRouter(value) {
            this.isGettingRouter = value; // 修改状态
        },
    },
});