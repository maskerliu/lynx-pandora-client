
import { Store } from 'pinia'
import { InjectionKey } from 'vue'
import { Router } from 'vue-router'
import { CommonAction, CommonState, IMAction, IMState, IOTAction, IOTState } from '../../store'

export const VueRouter = Symbol() as InjectionKey<Router>
export const Route = Symbol()
export const CommonStore = Symbol() as InjectionKey<Store<string, CommonState, {}, CommonAction>>
export const IMStore = Symbol() as InjectionKey<Store<string, IMState, {}, IMAction>>
export const IOTStore = Symbol() as InjectionKey<Store<string, IOTState, {}, IOTAction>>
export const I18n = Symbol() as InjectionKey<any>

export const NavBack = Symbol() as InjectionKey<() => void>
