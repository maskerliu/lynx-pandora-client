<template>

  <van-list style="height: 100%; overflow-y: auto;">
    <moment-item :moment="moment" v-for="moment in moments" />

    <comment-input-bar v-model:show="showCommentBar" :metioned-comment="metionedComment" />
  </van-list>
</template>
<script lang="ts" setup>
import { onMounted, provide, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Timeline } from '../../../models'
import { useCommonStore } from '../../../store'
import { ShowCommentInputBar } from '../../components/misc'
import CommentInputBar from './CommentInputBar.vue'
import MomentItem from './MomentItem.vue'

const commonStore = useCommonStore()
const router = useRouter()
const showCommentBar = ref(false)
const moments = ref<Array<Timeline.Moment>>([])
const metionedComment = ref<Timeline.Comment>(null)

provide(ShowCommentInputBar, showCommentInputBar)

function showCommentInputBar(comment?: Timeline.Comment) {
  showCommentBar.value = true
  metionedComment.value = comment
}

onMounted(() => {
  commonStore.navbar.title = '我的朋友圈'
  commonStore.navbar.rightText = 'icon-camera'
  commonStore.rightAction = () => {
    router.push({ name: 'CreateMoment' })
  }

  mockMoments()
})

function mockMoments() {
  let item: Timeline.Moment = {
    uid: commonStore.profile?.uid,
    timestamp: new Date().getTime(),
    desc: '我有一套阅微草堂笔记。狐狸这个，当时还和书友讨论着'
  }
  moments.value.push(item)

  item = {
    uid: commonStore.profile?.uid,
    timestamp: new Date().getTime(),
    images: [
      'https://images.unsplash.com/photo-1672651158855-f225fe553b0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
    ]
  }
  moments.value.push(item)

  item = {
    uid: commonStore.profile?.uid,
    timestamp: new Date().getTime(),
    desc: '我有一套阅微草堂笔记。狐狸这个，当时还和书友讨论着',
    images: [
      'https://images.unsplash.com/photo-1621439618653-bcbbad6f5976?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516534179168-865f98b909ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
    ]
  }
  moments.value.push(item)

  item = {
    uid: commonStore.profile?.uid,
    timestamp: new Date().getTime(),
    desc: '我有一套阅微草堂笔记。狐狸这个，当时还和书友讨论着,我有一套阅微草堂笔记。狐狸这个，当时还和书友讨论着,我有一套阅微草堂笔记。狐狸这个，当时还和书友讨论着',
    images: [
      'https://images.unsplash.com/photo-1603484681151-727dc2e01d18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1649926899494-b7d9a08d973f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1602542212259-720d433f8417?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1637591714341-9dba647018e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
    ]
  }
  moments.value.push(item)

  item = {
    uid: commonStore.profile?.uid,
    timestamp: new Date().getTime(),
    images: [
      'https://images.unsplash.com/photo-1602542212259-720d433f8417?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1637591714341-9dba647018e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      'https://img9.doubanio.com/view/photo/l/public/p2645827764.webp',
      'https://img9.doubanio.com/view/photo/l/public/p2645827764.webp',
      'https://img9.doubanio.com/view/photo/l/public/p2645827764.webp',
      'https://img9.doubanio.com/view/photo/l/public/p2645827764.webp',
      'https://img9.doubanio.com/view/photo/l/public/p2645827764.webp',
    ]
  }
  moments.value.push(item)

  item = {
    uid: commonStore.profile?.uid,
    timestamp: new Date().getTime(),
    desc: '我有一套阅微草堂笔记。狐狸这个，当时还和书友讨论着',
    images: [
      'https://img9.doubanio.com/view/photo/l/public/p2645827764.webp',
      'https://img9.doubanio.com/view/photo/l/public/p2645827764.webp',
      'https://img9.doubanio.com/view/photo/l/public/p2645827764.webp',
      'https://img9.doubanio.com/view/photo/l/public/p2645827764.webp',
      'https://img9.doubanio.com/view/photo/l/public/p2645827764.webp',
      'https://img9.doubanio.com/view/photo/l/public/p2645827764.webp',
      'https://img9.doubanio.com/view/photo/l/public/p2645827764.webp',
      'https://img9.doubanio.com/view/photo/l/public/p2645827764.webp',
      'https://img9.doubanio.com/view/photo/l/public/p2645827764.webp',
    ]
  }
  moments.value.push(item)
}

</script>
<style scoped>

</style>