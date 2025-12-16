import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
    state: () => ({
        isGlobalRouter: false, // 初始状态为 false
    }),
    actions: {
        setGlobalRouter(value) {
            this.isGlobalRouter = value; // 修改状态
        },
    },
});
//判断是否第一次登陆