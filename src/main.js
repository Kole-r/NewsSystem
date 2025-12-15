import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import pinia from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Particles from "@tsparticles/vue3"
import { loadFull } from "tsparticles";

const app = createApp(App);
app.use(Particles, {
    init: async engine => {
        await loadFull(engine); 
    },
});
app.use(router);
app.use(pinia);
app.use(ElementPlus);
app.use(Particles);
app.mount('#app');  