import { defineStore } from 'pinia';

export const useUserInfoStore = defineStore('userInfo', {
    state: () => ({}),
    actions: {
        setUserInfo(userInfo) {
            this.$state = { ...userInfo };
        },
        clearUserInfo() {
            this.$reset();
            localStorage.removeItem("userInfo"); // 清除持久化存储
        }
    },
    persist: true,
});

export default useUserInfoStore;