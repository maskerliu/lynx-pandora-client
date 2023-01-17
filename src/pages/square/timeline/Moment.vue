<template>
  <van-row class="moment">
    <van-image class="moment-avatar" round radius="5px"
      :src="`//${commonStore.appConfig?.staticServer + commonStore.profile?.avatar}`" />
    <van-col style="flex: 1;">
      <div v-if="moment.desc" class="van-multi-ellipsis--l2 moment-text">{{ moment.desc }}</div>
      <template v-if="moment.images?.length == 1">
        <img class="moment-single-image" @load="calcImageSize" @error="calcImageSize"
          :src="`//${commonStore.appConfig?.staticServer + moment.images[0]}`" />
      </template>
      <template v-else-if="moment.images?.length > 1">
        <van-grid column-num="3" :border="false" gutter="1" style="padding: 10px 15px 0 0;">
          <van-grid-item v-for="img in moment.images">
            <van-image :width="ItemWidth" :height="ItemWidth" fit="cover"
              :src="`//${commonStore.appConfig?.staticServer + img}`" />
          </van-grid-item>
        </van-grid>
      </template>
      <van-row class="moment-bottom" justify="space-between">
        <div>{{ $d(new Date(moment.timestamp ? moment.timestamp : 0), 'short')}}</div>
        <van-popover v-model:show="showPopover" placement="left" theme="dark">
          <van-row style="width: 150px; height: 32px; padding: 2px; color: white;">
            <van-button plain class="comment-button" :text="$t('square.moment.like')" @click="like">
              <template #icon>
                <van-icon class="iconfont icon-like" size="15" :color="isLiked ? '#c0392b' : 'white'"
                  style="font-weight: bold;" />
              </template>
            </van-button>
            <van-button plain class="comment-button" style="margin-left: 10px;" :text="$t('square.moment.comment')"
              @click="showComment()">
              <template #icon>
                <van-icon class="iconfont icon-comment" size="15" color="white" />
              </template>
            </van-button>
          </van-row>
          <template #reference>
            <van-icon class="iconfont icon-more" size="18" color="#95a5a6" style="font-weight: bold;" />
          </template>
        </van-popover>
      </van-row>

      <van-col class="moment-comment">
        <van-row style="padding: 5px 0; overflow-x: hidden;" v-if="moment.likes?.length > 0">
          <van-icon class="iconfont icon-like" size="12" color="#40739e" style="font-weight: bold; padding: 4px 5px;" />
          <div class="comment-user" v-for="user in moment.likes" style="margin-right: 5px;">{{ user.name }}</div>
        </van-row>
        <comment v-for="comment in moment.comments" :comment="comment" @click="showComment(comment)" />
      </van-col>
    </van-col>

    <comment-input-bar v-model:show="showCommentBar" :type="Timeline.CommentType.Moment" :post-id="moment._id"
      :metioned-comment="metionedComment" v-if="route.params['mid'] != null" />
  </van-row>

</template>
<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getScaleSize } from '../../../common/image.util'
import { Timeline } from '../../../models'
import { useCommonStore, useTimelineStore } from '../../../store'
import { ShowCommentInputBar } from '../../components/misc'
import Comment from './Comment.vue'
import CommentInputBar from './CommentInputBar.vue'

const props = defineProps<{
  data?: Timeline.Moment
}>()

const route = useRoute()
const commonStore = useCommonStore()
const timelineStore = useTimelineStore()

const showPopover = ref(false)
const showCommentBar = ref(false)
const metionedComment = ref<Timeline.Comment>(null)
const isLiked = ref(false)
const moment = ref<Timeline.Moment>({ uid: null })

const ItemWidth = document.body.clientWidth / 3 - 27
const MaxWidth = document.body.clientWidth / 2 - 15
const MaxHeight = 300

let showCommentInputBar: (pid: string, comment?: Timeline.Comment) => void

onMounted(() => {

  let mid = route.params['mid'] as string

  if (mid) {
    moment.value = timelineStore.curMoment
  }

  if (props.data) {
    moment.value = props.data
    showCommentInputBar = inject(ShowCommentInputBar)
  }

  isLiked.value = timelineStore.liked(moment.value, commonStore.profile.uid) != -1
})

function showComment(comment?: Timeline.Comment) {

  if (props.data) {
    showCommentInputBar(props.data._id, comment)
  } else {
    showCommentBar.value = true
    timelineStore.curMoment = moment.value
    metionedComment.value = comment
  }

  showPopover.value = false
}

async function like() {
  timelineStore.curMoment = moment.value
  await timelineStore.likeMoment(moment.value._id, commonStore.profile.uid, commonStore.profile.name)
  isLiked.value = timelineStore.liked(moment.value, commonStore.profile.uid) != -1
  showPopover.value = false
}

function calcImageSize(e: any) {
  if (e == null) { return }
  let img = (e.target != null ? e.target : e.path[0]) as HTMLImageElement
  if (e.type == 'load') {
    let [width, height] = getScaleSize(img.naturalWidth, img.naturalHeight, MaxWidth, MaxHeight)
    img.style.width = `${width}px`
    img.style.height = `${height}px`
  } else if (e.type == 'error') {
    img.style.opacity = '0'
    img.style.width = `${MaxWidth}px`
    img.style.height = `${MaxWidth}px`
    img.onerror = null
  }
}

</script>
<style>
.moment {
  padding-bottom: 10px;
}

.moment-avatar {
  width: 40px;
  height: 40px;
  padding: 10px;
}

.moment-single-image {
  border: solid 0;
  border-radius: 8px;
  margin: 10px 15px 0 0;
  object-fit: cover;
}

.moment-text {
  font-size: 1.0rem;
  color: #2c3e50;
  padding: 10px 15px 0 0;
}

.moment-bottom {
  font-size: 0.8rem;
  color: #95a5a6;
  padding: 5px 15px 8px 0;
}

.moment-comment {
  flex: 1;
  font-size: 0.9rem;
  background: #efeeea;
  margin-right: 15px;
  padding: 0 5px;
}

.comment-button {
  font-size: 0.7rem;
  color: white;
  width: 60px;
  height: 30px;
  margin-left: 5px;
  border: 0;
  padding: 0;
  background: transparent;
}

.comment-user {
  font-weight: bold;
  color: #40739e;
}
</style>