import { createI18n } from 'vue-i18n'

import zh_CN from './zh-CN'
import en from './en'


const messages = {
  'zh-CN': zh_CN,
  'en': en
}

const dateTimeFormats = {
  'zh-CN': {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric'
    }
  },
}

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages,
  datetimeFormats: {
    'zh-CN': {
      short: {
        hour: '2-digit',
        minute: '2-digit',
      },
      long: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    },
    'en': {
      short: {
        hour: '2-digit',
        minute: '2-digit',
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
  }
})

export default i18n