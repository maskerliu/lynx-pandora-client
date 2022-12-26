

import { defineStore } from 'pinia'
import { NavBarProps } from 'vant'
import { default as msgClient, default as PahoMsgClient } from '../common/PahoMsgClient'
import { Common, CommonApi, IOT, IOTApi, updateAccessToken, updateBaseDomain, User } from '../models'

export type CommonState = {
  navbar: NavBarProps,
  rightAction: Function,
  navbarBg?: string,
  navbarColor?: string,
  needLogin: boolean,
  appConfig?: Common.AppConfig,
  locale: string,
  accessToken?: string,
  profile?: User.Account & User.Profile,
  operator?: IOT.Operator,
  company?: IOT.Company,
  sharePrefs: SharePref,
  forword?: any,
}

export type CommonAction = {
  init(): Promise<void>
  updateUserInfo(): Promise<void>
  logout(): Promise<void>
}

export type SharePref = {
  sound: boolean,
  vibrate: boolean
}

export const useCommonStore = defineStore<string, CommonState, {}, CommonAction>('Common', {
  state: () => {
    return {
      navbar: {} as NavBarProps,
      rightAction: null,
      navbarBg: null,
      navbarColor: null,
      needLogin: false,
      appConfig: null as Common.AppConfig,
      locale: null,
      accessToken: null,
      profile: null,
      operator: null,
      company: null,
      sharePrefs: {} as SharePref,
      forword: null,
    }
  },
  actions: {
    async init() {
      updateBaseDomain(SERVER_BASE_URL)
      this.updateUserInfo()
    },
    async updateUserInfo() {
      if (this.accessToken == null) return

      updateAccessToken(this.accessToken)
      this.profile = await CommonApi.getMyProfile()
      this.appConfig = await CommonApi.getAppConfig()

      this.operator = await IOTApi.getMyOperatorInfo()
      if (this.operator) {
        this.company = await IOTApi.getCompany(this.operator.cid)
      }
    },
    async logout() {
      this.accessToken = null
      this.profile = {}
      this.operator = {}
      this.company = {}
      msgClient.close()
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'common',
        storage: localStorage,
        paths: ['locale', 'accessToken', 'sharePrefs']
      },
    ],
  }
})