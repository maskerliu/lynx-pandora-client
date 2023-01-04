<template>
  <van-row style="width: 100%; padding-bottom: 10px;">
    <van-image class="moment-avatar" :src="'//' + commonStore.appConfig?.staticServer + commonStore.profile?.avatar"
      round radius="5px" />
    <van-col style="flex: 1;">
      <div v-if="moment.desc" class="van-multi-ellipsis--l2 moment-text">{{ moment.desc }}</div>
      <template v-if="moment.images?.length == 1">
        <van-image style="padding: 10px 15px 0 0;" :src="moment.images[0]" :width="MaxWidth" :height="MaxWidth" round
          fit="cover" radius="5px" @load="calcImageSize" />
      </template>
      <template v-else-if="moment.images?.length > 1">
        <van-grid column-num="3" :border="false" gutter="1" style="padding: 10px 15px 0 0;">
          <van-grid-item v-for="img in moment.images">
            <van-image :src="img" :width="ItemWidth" :height="ItemWidth" fit="cover" />
          </van-grid-item>
        </van-grid>
      </template>
      <van-row style="font-size: 0.9rem; color: #95a5a6; padding: 5px 15px 8px 0;" justify="space-between">
        <div>5小时前</div>
        <van-popover v-model:show="showPopover" placement="left" theme="dark">
          <van-row style="width: 140px; height: 32px; padding: 2px; color: white;">
            <van-button plain class="comment-button" text="赞">
              <template #icon>
                <van-icon class="iconfont icon-like" size="15" color="white" />
              </template>
            </van-button>
            <van-button plain class="comment-button" style="margin-left: 10px;" text="评论"
              @click="showCommentInputBar()">
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

      <van-col style="flex: 1; font-size: 0.9rem; background: #efeeea; margin-right: 15px; padding: 0 5px;">
        <van-row style="padding: 5px 0;">
          <van-icon class="iconfont icon-like" size="12" color="#40739e" style="font-weight: bold; padding: 4px 5px;" />
          <div class="comment-user">章三</div>
        </van-row>
        <comment v-for="comment in comments" :comment="comment" />
      </van-col>
    </van-col>
  </van-row>

</template>
<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue';
import { getScaleSize } from '../../../common/image.util'
import { Timeline } from '../../../models'
import { useCommonStore } from '../../../store'
import { ShowCommentInputBar } from '../../components/misc'
import Comment from './Comment.vue'

defineProps<{
  moment: Timeline.Moment
}>()

const commonStore = useCommonStore()
const showCommentInputBar = inject(ShowCommentInputBar)
const showPopover = ref(false)
const comments = ref<Array<Timeline.Comment>>([])


const ItemWidth = document.body.clientWidth / 3 - 27
const MaxWidth = document.body.clientWidth / 2 - 15
const MaxHeight = 300

onMounted(() => {

  mockComments()
})

function mockComments() {
  comments.value.push({
    uid: '',
    name: '章三',
    content: '太好啦',
    timestamp: new Date().getTime()
  })

  comments.value.push({
    uid: '',
    name: '里斯',
    content: '哈哈',
    timestamp: new Date().getTime()
  })

  comments.value.push({
    uid: '',
    name: '章三',
    mention: '',
    mentionName: '里斯',
    content: '堵死啦',
    timestamp: new Date().getTime()
  })

  comments.value.push({
    uid: '',
    name: '里斯',
    mention: '',
    mentionName: '章三',
    content: '人太多了',
    timestamp: new Date().getTime()
  })
}

function calcImageSize(e: any) {
  if (e == null) { return }
  let img = (e.target != null ? e.target : e.path[0]) as HTMLImageElement
  let item = img.parentElement
  if (e.type == 'load') {
    let [width, height] = getScaleSize(img.naturalWidth, img.naturalHeight, MaxWidth, MaxHeight)
    img.style.width = `${width}px`
    img.style.height = `${height}px`
    item.style.height = `${height}px`
  } else if (e.type == 'error') {
    img.style.opacity = '0'
    img.style.width = `${MaxWidth}px`
    img.style.height = `${MaxWidth}px`
    img.onerror = null
  }
}

</script>
<style>
.moment-avatar {
  width: 40px;
  height: 40px;
  padding: 10px;
}

.moment-text {
  font-size: 1.0rem;
  color: #2c3e50;
  padding: 10px 15px 0 0;
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