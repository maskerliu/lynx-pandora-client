import '@vant/touch-emulator'
import { createPinia } from 'pinia'
import vant from 'vant'
import 'vant/lib/index.css'
import { createApp } from 'vue'
import i18n from './lang'
import router from './router'
import App from './App.vue'
// import 'default-passive-events'
import piniaPersist from 'pinia-plugin-persist'

const pinia = createPinia()
const app = createApp(App)

pinia.use(piniaPersist)

app.use(i18n)
app.use(router)
app.use(pinia)
app.use(vant)
app.mount('#app')
