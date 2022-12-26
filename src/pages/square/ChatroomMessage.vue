<template>
  <van-row class="message">
    <van-image round radius="2rem" width="2rem" height="2rem" class="user-avatar" fit="cover" :src="avatar" />
    <div class="message-content">
      <div class="message-text">
        <template v-if="(message.type == IM.MessageType.TEXT || message.type == IM.MessageType.EMOJI)">
          <!-- 文字 -->
          <span ref="msg-content">{{ message.content }}</span>
        </template>
        <template v-else-if="(message.type == IM.MessageType.IMAGE)">
          <van-image ref="image" block :width="width" :height="height" :src="message.content"
            :show-loading="message.sent < 1" @load="calcImageSize" @error="calcImageSize" @click="onPreview" />
        </template>
        <template v-else-if="(message.type == IM.MessageType.AUDIO)">
          <!-- 语音 -->
          <van-row ref="msg-content" style="width: 80px; flex: 1;" @click="play">
            <audio ref="audioRef" :src="message.content" />
            <van-icon class="iconfont icon-audio" color="grey" size="20" />
            <div>{{ audioRef?.duration }} '</div>
          </van-row>
        </template>
        <template v-else-if="(message.type == IM.MessageType.VIDEO)">
          <!-- 视频 -->
          <p ref="msg-content">{{ message.content }}</p>
        </template>
      </div>
      <div class="message-timestamp" :style="{ 'justify-content': 'baseline', 'flex-direction': 'row' }">
        <div>{{ $d(new Date(message.timestamp), 'short') }}</div>
      </div>
    </div>
  </van-row>
</template>
<script lang="ts" setup>
import { showImagePreview } from 'vant'
import { onMounted, ref } from 'vue'
import { getScaleSize } from '../../common/image.util'
import { IM } from '../../models'
import { useCommonStore, useIMStore } from '../../store'

const props = defineProps<{
  message: IM.Message,
  asyncMode?: Boolean,
}>()

const commonStore = useCommonStore()
const imStore = useIMStore()
const avatar = ref()
const audioRef = ref<HTMLAudioElement>()

const width = ref(100)
const height = ref(100)

const clientWidth = document.body.clientWidth * 0.4
const clientHeight = document.body.clientHeight * 0.25

onMounted(async () => {
  // let user = await imStore.user(props.message.uid)
  // avatar.value = user?.avatar

  switch (props.message.type) {
    case IM.MessageType.IMAGE:
      break
    case IM.MessageType.AUDIO:
      // console.log(audioRef.value.duration)
      break
  }
})

function calcImageSize(e: any) {
  if (e.type == 'load') {
    let img = (e.target != null ? e.target : e.path[0]) as HTMLImageElement
    [width.value, height.value] = getScaleSize(img.naturalWidth, img.naturalHeight, clientWidth, clientHeight)
  }
}

function play() {
  audioRef.value?.play()
}

function onPreview() {
  if (props.message.content != null && props.message.content.length > 0)
  showImagePreview({ images: [props.message.content], showIndex: false })
}

</script>

<style lang="css" scoped>
.message {
  position: relative;
  padding: 5px;
}

.message-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  flex-grow: 1;
  align-items: flex-start;
}

.message-image {
  display: flex;
}

.user-avatar {
  border-radius: 32px;
  border-radius: 50%;
  margin: auto 10px;
}

.message-timestamp {
  padding: 2px;
  margin: 0;
  overflow-wrap: break-word;
  font-size: 10px;
  color: #bdb8b8;
  width: 100px;
  display: flex;
  flex-flow: row;
  flex-direction: row-reverse;
}

.message-text {
  color: #ecf0f1;
  background: #0807077d;
  padding: 10px 10px;
  border-radius: 15px 0 15px 0;
  margin: 5px 0;
  max-width: 70%;
  font-size: 0.8rem;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-text:active {
  background: #eeeeee;
}
</style>