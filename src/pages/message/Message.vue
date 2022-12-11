<template>
  <van-row class="message-body">
    <van-image radius="5" class="user-avatar from" fit="cover" v-if="isFrom" :src="avatar" />
    <div class="message-content" v-bind:class="isFrom ? 'from' : 'to'">
      <div class="message-text" v-bind:class="isFrom ? 'from' : 'to'">
        <template v-if="(message.type == IM.MessageType.TEXT || message.type == IM.MessageType.EMOJI)">
          <!-- 文字 -->
          <span ref="msg-content">{{ message.content }}</span>
        </template>
        <template v-else-if="(message.type == IM.MessageType.IMAGE)">
          <van-image :src="message.content" :show-loading="message.sent" @click="onPreview" />
        </template>
        <template v-else-if="(message.type == IM.MessageType.AUDIO)">
          <!-- 语音 -->
          <div ref="msg-content" style="width: 80px; flex: 1;">
            <van-icon class="iconfont icon-audio" color="grey" size="20" />
            <div>10'</div>
          </div>
        </template>
        <template v-else-if="(message.type == IM.MessageType.VIDEO)">
          <!-- 视频 -->
          <p ref="msg-content">{{ message.content }}</p>
        </template>
      </div>
      <div class="message-timestamp"
        :style="{ 'justify-content': 'baseline', 'flex-direction': isFrom ? 'row' : 'row-reverse' }">
        <div>{{ $d(new Date(message.timestamp), 'short') }}</div>
        <van-icon v-if="(asyncMode && message.sent && !message.read)" :size="14" name="success" />
        <van-icon v-else-if="(asyncMode && message.sent && message.read)" :size="14" name="certificate" />
        <van-icon v-if="asyncMode && message.sent && !message.read" :size="8" class="iconfont icon-check" />
        <van-icon v-else-if="asyncMode && message.sent && message.read" :size="8" class="iconfont icon-double-check" />
        <div v-else-if="asyncMode" class="message-loading"></div>
      </div>
    </div>
    <van-image radius="5" class="user-avatar to" fit="cover" :src="commonStore.profile.avatar" v-if="!isFrom" />
  </van-row>
</template>
<script lang="ts" setup>
import { nextTick } from 'process'
import { ImagePreview } from 'vant'
import { inject, onMounted, ref } from 'vue'
import { IM } from '../../models'
import { CommonStore, IMStore } from '../components/misc'

const props = defineProps<{
  message: IM.Message,
  asyncMode?: Boolean,
}>()

const commonStore = inject(CommonStore)
const imStore = inject(IMStore)
const isFrom = ref(false)
const avatar = ref()

onMounted(async () => {
  isFrom.value = props.message.uid != commonStore.profile.uid
  let user = await imStore.user(props.message.uid)
  avatar.value = user?.avatar
  nextTick(() => {
    // linkifyElement(msgContent.value, linkOptions, document)
  })
})


function onPreview() {
  ImagePreview([props.message.content])
}

</script>

<style lang="css" scoped>
.message-body {
  position: relative;
  padding: 5px 10px 0 10px;
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
  bottom: -10px;
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

.message-text.to {
  background: #27ae60;
  border-bottom-right-radius: 0px;
  /* border-top-left-radius: 0px; */
}
</style>