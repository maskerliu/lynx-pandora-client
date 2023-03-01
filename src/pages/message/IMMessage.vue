<template>

  <van-row class="message" :justify="justify">
    <template v-if="message.type == IM.MessageType.SYSTEM">
      <div style="font-size: 0.8rem; color: #7f8c8d; text-align: center;">{{ '章三 领取了你的红包' }}</div>
    </template>
    <template v-else>
      <van-image radius="8" class="user-avatar" fit="cover" v-if="isFrom"
        :src="`//${commonStore.appConfig?.staticServer + avatar}`" />
      <div ref="msgContentRef" class="msg-content" :class="isFrom ? 'from' : 'to'">
        <van-popover v-model:show="showEmojiMenu" trigger="manual" :placement="menuPosition" theme="dark" overlay
          :overlay-style="{ background: 'transparent' }">
          <van-row class="msg-menu">
            <van-button plain class="msg-menu-btn" @click="addCustomEmoji"
              v-if="message.type == IM.MessageType.EMOJI && isFrom">
              <template #icon>
                <van-icon class="msg-menu-icon iconfont icon-add-emoji" />
                <div class="msg-menu-name">{{ $t('message.session.addEmoji') }}</div>
              </template>
            </van-button>
            <van-button plain class="msg-menu-btn" @click="deleteMsg">
              <template #icon>
                <van-icon class="msg-menu-icon iconfont icon-delete" />
                <div class="msg-menu-name">{{ $t('message.session.delMsg') }}</div>
              </template>
            </van-button>
            <van-button plain class="msg-menu-btn" @click="quote">
              <template #icon>
                <van-icon class="msg-menu-icon iconfont icon-quote" />
                <div class="msg-menu-name">{{ $t('message.session.quote') }}</div>
              </template>
            </van-button>
            <van-button plain class="msg-menu-btn" @click="onMultiSelect">
              <template #icon>
                <van-icon class="msg-menu-icon iconfont icon-multi-select" />
                <div class="msg-menu-name">{{ $t('message.session.multiSelect') }}</div>
              </template>
            </van-button>
            <van-button plain class="msg-menu-btn" @click="forward">
              <template #icon>
                <van-icon class="msg-menu-icon iconfont icon-forward" />
                <div class="msg-menu-name">{{ $t('message.session.forward') }}</div>
              </template>
            </van-button>
          </van-row>
          <template #reference>
            <div @click="onMessageClicked">
              <!-- 文字 -->
              <div class="msg-text" v-bind:class="isFrom ? 'from' : 'to'" v-if="message.type == IM.MessageType.TEXT">
                <div>{{ message.content }}</div>
              </div>
              <red-packet-msg :message="message" v-else-if="message.type == IM.MessageType.RedPacket" />

              <van-image width="5rem" height="5rem" lazy-load fit="cover" round radius="8px"
                :src="`//${commonStore.appConfig.staticServer + message.content}`"
                v-else-if="message.type == IM.MessageType.EMOJI">
                <template #error>
                  <van-icon class="iconfont icon-emoji" size="3rem" color="#bdc3c7" />
                </template>
              </van-image>
              <van-image ref="image" round radius="10" :width="width" :height="height" @load="calcImageSize"
                @error="calcImageSize" :src="`//${commonStore.appConfig.staticServer + message.content}`"
                v-else-if="(message.type == IM.MessageType.IMAGE)" />

              <!-- 语音 -->
              <van-row style="width: 80px; flex: 1;" @click="play" v-else-if="(message.type == IM.MessageType.AUDIO)">
                <audio ref="audioRef" :src="message.content" />
                <van-icon class="iconfont icon-audio" color="grey" size="20" />
                <div>{{ audioRef?.duration }} '</div>
              </van-row>

              <!-- 视频 -->
              <p v-else-if="(message.type == IM.MessageType.VIDEO)">{{ message.content }}</p>
            </div>
          </template>
        </van-popover>
        <div class="msg-timestamp"
          :style="{ 'justify-content': 'baseline', 'flex-direction': isFrom ? 'row' : 'row-reverse' }">
          <div>{{ $d(new Date(message.timestamp), 'short') }}</div>
          <van-icon v-if="!isFrom && message.sent == 1" :size="14" name="success" color="#2ecc71" />
          <van-icon v-else-if="!isFrom && message.sent == -1" :size="14" name="warning-o" color="#e74c3c" />
          <div v-else-if="!isFrom && message.sent == 0" class="message-loading"></div>
        </div>
      </div>
      <van-image radius="8" class="user-avatar" fit="cover" v-if="!isFrom"
        :src="`//${commonStore.appConfig?.staticServer + avatar}`" />
    </template>

  </van-row>
</template>
<script lang="ts" setup>
import { PopoverPlacement, RowJustify, showImagePreview } from 'vant'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getScaleSize } from '../../common/image.util'
import { IM } from '../../models'
import { useCommonStore, useIMStore } from '../../store'
import RedPacketMsg from './RedPacketMsg.vue'

const props = defineProps<{
  message: IM.Message,
  asyncMode?: Boolean,
}>()

const emits = defineEmits(['message-clicked'])

const router = useRouter()
const commonStore = useCommonStore()
const imStore = useIMStore()

const showEmojiMenu = ref(false)
const avatar = ref()
const audioRef = ref<HTMLAudioElement>()
const msgContentRef = ref<HTMLElement>()
const menuPosition = ref<PopoverPlacement>('bottom-end')

const width = ref(100)
const height = ref(100)

const clientWidth = document.body.clientWidth * 0.4
const clientHeight = document.body.clientHeight * 0.25

let isFrom = false
let justify: RowJustify = 'center'

onMounted(async () => {
  isFrom = props.message.uid != commonStore.profile.uid
  if (props.message.type == IM.MessageType.SYSTEM) justify = 'center'
  else justify = isFrom ? 'start' : 'end'

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

function onMessageClicked() {
  if (props.message.type == IM.MessageType.RedPacket || props.message.type == IM.MessageType.IMAGE) {
    emits('message-clicked')
    return
  }

  showEmojiMenu.value = !showEmojiMenu.value

  if (document.body.clientHeight / 2 > msgContentRef.value.getBoundingClientRect().top) {
    menuPosition.value = isFrom ? 'bottom-start' : 'bottom-end'
  } else {
    menuPosition.value = isFrom ? 'top-start' : 'top-end'
  }
}

async function addCustomEmoji() {
  let emoji: IM.IMEmoji = {
    snap: props.message.snap,
    gif: props.message.content
  }
  await imStore.addCustomEmoji(null, emoji)
  showEmojiMenu.value = false
}

async function quote() {
  imStore.quoteMessage = props.message
  showEmojiMenu.value = false
}

async function deleteMsg() {
  await imStore.deleteMessage(props.message._id)
  showEmojiMenu.value = false
}

async function onMultiSelect() {

}

async function forward() {
  router.push({ name: 'ForwardSelector' })
}

</script>

<style lang="css" scoped>
.message {
  position: relative;
  padding: 5px 10px 15px 10px;
}

.msg-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  flex-grow: 1;
}

.msg-content.from {
  align-items: flex-start;
}

.msg-content.to {
  align-items: flex-end;
}

.msg-image {
  display: flex;
}

.user-avatar {
  width: 45px;
  height: 45px;
  margin: 5px 10px;
}

.msg-timestamp {
  max-width: 100px;
  padding: 2px;
  margin: 0;
  overflow-wrap: break-word;
  font-size: 10px;
  color: #bdb8b8;
  display: flex;
  flex-flow: row;
  flex-direction: row-reverse;
}

.msg-text {
  color: #2c3e50;
  background: #fff;
  padding: 10px;
  border-radius: 15px;
  margin: 5px 0;
  max-width: 65vw;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  word-break: break-word;
}

.msg-text.from {
  border-bottom-left-radius: 0px;
  /* border-top-right-radius: 0px; */
}

.msg-text.from:active {
  background: #eeeeee;
}

.msg-text.to {
  background: #27ae60;
  border-bottom-right-radius: 0px;
  /* border-top-left-radius: 0px; */
}

.msg-text.to:active {
  background: #1b8651;
}

.msg-loading {
  height: 8px;
  width: 8px;
  border: 1px solid rgb(187, 183, 183);
  border-left-color: rgb(59, 59, 59);
  border-radius: 50%;
  margin-left: 5px;
  display: inline-block;
  animation: spin 1.3s ease infinite;
}


.msg-menu {
  max-width: 185px;
  padding: 2px;
  margin-bottom: 15px;
}

.msg-menu-btn {
  padding: 5px;
  margin-top: 10px;
  background: transparent;
  border: 0;
  color: white;
}

.msg-menu-icon {
  padding-top: 10px;
  font-size: 1.2rem;
}

.msg-menu-name {
  margin: 5px;
  font-size: 0.8rem;
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