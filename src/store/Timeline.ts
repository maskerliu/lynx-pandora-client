import { defineStore } from 'pinia'
import { Timeline, TimelineApi } from '../models'

export type TimelineState = {

  moments: Array<Timeline.Moment>
  curMoment?: Timeline.Moment
}

export interface TimelineAction {

  loadMore(uid: string, page: number): Promise<boolean>
  likeMoment(momentId: string, uid: string, name: string): Promise<void>
  liked(moment: Timeline.Moment, uid: string): number
  pubComment(comment: Timeline.Comment): Promise<void>

}

export const useTimelineStore = defineStore<string, TimelineState, {}, TimelineAction>('Timeline', {
  state: () => {
    return {
      moments: [],
      curMoment: null,
    }
  },
  actions: {
    async loadMore(uid: string, page: number) {
      let result = await TimelineApi.moments(uid, page)

      this.moments.push(...result)

      return result.length != 0
    },
    async likeMoment(momentId: string, uid: string, name: string) {
      await TimelineApi.momentLike(this.curMoment._id)

      let idx = this.liked(this.curMoment, uid)
      if (idx != -1) {
        this.curMoment.likes.splice(idx, 1)
      } else {
        this.curMoment.likes.push({ uid, name })
      }
    },
    liked(moment: Timeline.Moment, uid: string) {
      return moment.likes?.findIndex(it => { return it.uid == uid })
    },
    async pubComment(comment: Timeline.Comment) {
      await TimelineApi.commentPub(comment)
      this.curMoment.comments.push(comment)
    },
  }
})