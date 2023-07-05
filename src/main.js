import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueQriously from 'vue-qriously'

const app = createApp(App)

createApp(App).use(router).use(VueQriously).mount("#app");
