import '@vant/touch-emulator'
import { createPinia } from 'pinia'
import vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
import { MotionPlugin } from '@vueuse/motion'
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
// import 'default-passive-events'
import piniaPersist from 'pinia-plugin-persist'
import { createI18n } from 'vue-i18n'

import en from './locales/en.json'
import zh from './locales/zh-CN.json'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: {
    en,
    'zh-CN': zh
  },
  datetimeFormats: {
    'zh-CN': {
      short: {
        hour: '2-digit',
        minute: '2-digit',
      },
      middle: {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      },
      day: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
      long: {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }
    },
    'en': {
      short: {
        hour: '2-digit',
        minute: '2-digit',
      },
      middle: {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      },
      day: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
      long: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    }
  },
  numberFormats: {
    'zh-CN': {
      currency: {
        style: 'decimal',
        currency: 'RMB',
        currencyDisplay: 'code',
        // maximumSignificantDigits: 3,
        signDisplay: 'never'
      }
    },
    'en': {
      currency: {
        style: 'decimal',
        currency: 'USD',
        currencyDisplay: 'code',
        // maximumSignificantDigits: 3,
        signDisplay: 'never'
      }
    }
  }
})
const pinia = createPinia()
const app = createApp(App)

pinia.use(piniaPersist)
app.use(MotionPlugin)
app.use(i18n)
app.use(router)
app.use(pinia)
app.use(vant)
app.use(Lazyload)
app.mount('#app')

useVConsole()

async function useVConsole() {
  if (__DEV__) {
    try {
      // const VConsole = await import('vconsole')
      // new VConsole.default()
      console.log()
    } catch (err) { console.log(err) }
  }
}