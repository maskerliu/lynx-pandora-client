import { Square, Timeline } from '.'
import { RemoteAPI } from './api.const'
import { formPost, get, post } from './base.api'

export namespace SquareApi {
  export function recommends() {
    return get<Array<Square.Feed>>(RemoteAPI.Square.BasePath + RemoteAPI.Square.Recommend)
  }

  export function myCollections() {
    return get<Array<Square.Feed>>(RemoteAPI.Square.BasePath + RemoteAPI.Square.MyCollections)
  }
}

export namespace TimelineApi {

  export function posts(uid: string, page: number) {
    return get<Array<Timeline.Post>>(RemoteAPI.Timeline.BasePath + RemoteAPI.Timeline.Posts, { uid, page })
  }

  export function postPub(data: Timeline.Post) {
    return post<string>(RemoteAPI.Timeline.BasePath + RemoteAPI.Timeline.MomentPub, data)
  }

  export function postDel(postId: string) {
    return post<string>(RemoteAPI.Timeline.BasePath + RemoteAPI.Timeline.MomentDel, { postId })
  }

  export function moments(uid: string, page: number) {
    return get<Array<Timeline.Moment>>(RemoteAPI.Timeline.BasePath + RemoteAPI.Timeline.Moments, { uid, page })
  }

  export function momentPub(moment: Timeline.Moment, images: Array<File>) {
    let data = new FormData()
    data.append('moment', JSON.stringify(moment))
    for (let i = 0; i < images.length; ++i) {
      data.append(`image${i}`, images[i])
    }

    return formPost<string>(RemoteAPI.Timeline.BasePath + RemoteAPI.Timeline.MomentPub, data)
  }

  export function momentDel(momentId: string) {
    return post<string>(RemoteAPI.Timeline.BasePath + RemoteAPI.Timeline.MomentDel, { momentId })
  }

  export function momentLike(momentId: string) {
    return post<string>(RemoteAPI.Timeline.BasePath + RemoteAPI.Timeline.MomentLike, { momentId })
  }

  export function comments(postId: string, page: number) {
    return get<Array<Timeline.Comment>>(RemoteAPI.Timeline.BasePath + RemoteAPI.Timeline.Comments, { postId, page })
  }

  export function commentPub(comment: Timeline.Comment) {
    return post<string>(RemoteAPI.Timeline.BasePath + RemoteAPI.Timeline.CommentPub, comment)
  }

  export function commentDel(commentId: string) {
    return post<string>(RemoteAPI.Timeline.BasePath + RemoteAPI.Timeline.CommentPub, { commentId })
  }

}