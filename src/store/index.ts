import {defineStore} from "pinia";

export const useGlobalStore = defineStore({
    id: 'global',
    state: () => ({
        sk: '',
    }),
    getters: {
        getSk(): string {
            return this.sk;
        }
    },
    actions: {
        setSk(sk: string) {
            this.sk = sk;
        },
    },
    persist: {
        storage: sessionStorage
    }
})