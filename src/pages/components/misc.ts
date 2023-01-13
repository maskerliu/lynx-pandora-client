
import { InjectionKey } from 'vue'
import { Timeline } from '../../models'

export const NavBack = Symbol() as InjectionKey<() => void>
export const CalcSquareFeedHeight = Symbol() as InjectionKey<(e: any) => void>
export const ShowCommentInputBar = Symbol() as InjectionKey<(pid: string, comment?: Timeline.Comment) => void>