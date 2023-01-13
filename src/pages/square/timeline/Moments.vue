<template>

  <van-list style="height: 100%; overflow-y: auto;" @load="getMoments" :finished="isFinished">
    <moment :data="moment" v-for="moment in timelineStore.moments" />

    <comment-input-bar v-model:show="showCommentBar" :type="Timeline.CommentType.Moment" :post-id="postId"
      :metioned-comment="metionedComment" />
  </van-list>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { Timeline } from '../../../models'
import { useCommonStore, useTimelineStore } from '../../../store'
import { ShowCommentInputBar } from '../../components/misc'
import CommentInputBar from './CommentInputBar.vue'
import Moment from './Moment.vue'

const commonStore = useCommonStore()
const timelineStore = useTimelineStore()
const i18n = useI18n()
const router = useRouter()
const route = useRoute()
const showCommentBar = ref(false)
const metionedComment = ref<Timeline.Comment>(null)
const isFinished = ref(false)
const postId = ref(null)

provide(ShowCommentInputBar, showCommentInputBar)

let uid: string = null
let page = 0

onMounted(() => {
  commonStore.navbar.title = i18n.t('square.moment.myMoments')
  commonStore.navbar.rightText = 'icon-camera'
  commonStore.rightAction = () => {
    router.push({ name: 'CreateMoment' })
  }

  uid = route.params['uid'] as string
})

onUnmounted(() => {
  timelineStore.moments = []
})

function showCommentInputBar(pid: string, comment?: Timeline.Comment) {
  showCommentBar.value = true
  postId.value = pid
  metionedComment.value = comment
}

async function getMoments() {
  isFinished.value = await timelineStore.loadMore(uid, page++)
}

</script>
<style scoped>

</style>