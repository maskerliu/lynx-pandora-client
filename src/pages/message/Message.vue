<template>
  <van-row class="message">
    <van-image radius="5" class="user-avatar from" fit="cover" v-if="isFrom"
      :src="'//' + commonStore.appConfig?.staticServer + avatar" />
    <div class="message-content" v-bind:class="isFrom ? 'from' : 'to'">
      <div class="message-text" v-bind:class="isFrom ? 'from' : 'to'">
        <template v-if="(message.type == IM.MessageType.TEXT || message.type == IM.MessageType.EMOJI)">
          <!-- 文字 -->
          <span>{{ message.content }}</span>
        </template>
        <template v-else-if="(message.type == IM.MessageType.IMAGE)">
          <van-image ref="image" block :width="width" :height="height" :src="message.content"
            :show-loading="message.sent < 1" @load="calcImageSize" @error="calcImageSize" @click="onPreview" />
        </template>
        <template v-else-if="(message.type == IM.MessageType.AUDIO)">
          <!-- 语音 -->
          <van-row style="width: 80px; flex: 1;" @click="play">
            <audio ref="audioRef" :src="message.content" />
            <van-icon class="iconfont icon-audio" color="grey" size="20" />
            <div>{{ audioRef?.duration }} '</div>
          </van-row>
        </template>
        <template v-else-if="(message.type == IM.MessageType.VIDEO)">
          <!-- 视频 -->
          <p>{{ message.content }}</p>
        </template>
      </div>
      <div class="message-timestamp"
        :style="{ 'justify-content': 'baseline', 'flex-direction': isFrom ? 'row' : 'row-reverse' }">
        <div>{{ $d(new Date(message.timestamp), 'short') }}</div>
        <van-icon v-if="!isFrom && message.sent == 1" :size="14" name="success" color="#2ecc71" />
        <van-icon v-else-if="!isFrom && message.sent == -1" :size="14" name="warning-o" color="#e74c3c" />
        <div v-else-if="!isFrom && message.sent == 0" class="message-loading"></div>
      </div>
    </div>
    <van-image radius="5" class="user-avatar to" fit="cover" v-if="!isFrom"
      :src="'//' + commonStore.appConfig?.staticServer + commonStore.profile.avatar" />
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
const isFrom = ref(false)
const avatar = ref()
const audioRef = ref<HTMLAudioElement>()

const width = ref(100)
const height = ref(100)

const clientWidth = document.body.clientWidth * 0.4
const clientHeight = document.body.clientHeight * 0.25

onMounted(async () => {
  isFrom.value = props.message.uid != commonStore.profile.uid
  let user = await imStore.user(props.message.uid)
  avatar.value = user?.avatar

  switch (props.message.type) {
    case IM.MessageType.IMAGE:
      break
    case IM.MessageType.AUDIO:
      // console.log(audioRef.value.duration)
      break
  }
})

function calcImageSize(e: any) {
  if (e?.type == 'load') {
    let img = (e.target != null ? e.target : e.path[0]) as HTMLImageElement
    [width.value, height.value] = getScaleSize(img.naturalWidth, img.naturalHeight, clientWidth, clientHeight)
  }
}

function play() {
  audioRef.value.play()
}

function onPreview() {
  if (props.message.content != null && props.message.content.length > 0)
    showImagePreview({ images: [props.message.content], showIndex: false })
}

</script>

<style lang="css" scoped>
.message {
  position: relative;
  padding: 5px 10px 15px 10px;
}

.message-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  flex-grow: 1;
}

.message-content.from {
  margin-left: 60px;
  align-items: flex-start;
}

.message-content.to {
  margin-right: 60px;
  align-items: flex-end;
}

.message-image {
  display: flex;
}

.user-avatar {
  width: 45px;
  height: 45px;
  position: absolute;
  bottom: 5px;
  border-radius: 50%;
}

.user-avatar.from {
  margin-right: 10px;
}

.user-avatar.to {
  right: 10px;
  margin-left: 10px;
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
  color: #2c3e50;
  background: #fff;
  padding: 10px 10px;
  border-radius: 15px;
  margin: 5px 0;
  max-width: 70%;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-text.from {
  border-bottom-left-radius: 0px;
  /* border-top-right-radius: 0px; */
}

.message-text.from:active {
  background: #eeeeee;
}

.message-text.to {
  background: #27ae60;
  border-bottom-right-radius: 0px;
  /* border-top-left-radius: 0px; */
}

.message-text.to:active {
  background: #1b8651;
}

.message-loading {
  height: 8px;
  width: 8px;
  border: 1px solid rgb(187, 183, 183);
  border-left-color: rgb(59, 59, 59);
  border-radius: 50%;
  margin-left: 5px;
  display: inline-block;
  animation: spin 1.3s ease infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>