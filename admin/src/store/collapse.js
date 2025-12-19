import { defineStore } from 'pinia';

export const useCollapseStore = defineStore('collapse', {
    state: () => ({
        isCollapsed: false, // 初始状态为 false
    }),
    actions: {
        setCollapsed() {
            this.isCollapsed = !this.isCollapsed; // 修改状态
        }
    },
    persist: true,
});//记录侧边栏折叠状态