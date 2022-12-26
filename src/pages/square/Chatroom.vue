<template>

  <van-col :style="{
    background: `${chatroomStore.curRoom?.background ? 'url(' + chatroomStore.curRoom?.background + ')' : '#0a3d62'}`, backgroundSize: 'cover'
  }">
    <van-collapse v-model="showSeatPanel" accordion>
      <van-collapse-item name="1" class="bg-border top-panel" style="border: 0; border-radius: 5px; padding:0;">
        <template #title>
          <van-row style="background: transparent;">
            <van-image round radius="8" width="4rem" height="4rem" :src="chatroomStore.curRoom?.cover" />
            <div style="width: calc(100vw - 140px); padding: 0 0 5px 15px;">
              {{ chatroomStore.curRoom?.title }}
              <van-notice-bar background="#fff0" style="padding: 0;" left-icon="volume-o"
                :text="chatroomStore.curRoom?.notice" />
            </div>
          </van-row>
        </template>
        <van-row
          style="border-radius: 0 0 8px 8px; border: 0; background-color: transparent; margin-top: 0; padding: 15px 0;">
          <seat v-for="item in chatroomStore.curRoom?.seats" :seat-info="item"
            @click="showSeatMgr = true; curSeatInfo = item;" />
        </van-row>
      </van-collapse-item>
    </van-collapse>

    <van-row :style="{ height: `calc(100% - ${offsetHeight}px)`, padding: '10px' }">
      <van-list style="flex: 1; height: 100%; overflow-y: auto;">
        <chatroom-message :message="item" v-for="item in messages" />
      </van-list>
      <van-col style="width: 100px; height: 200px; background: #1817177d; border-radius: 15px; color: #ecf0f1;">
        活动
      </van-col>
    </van-row>

    <seat-mgr v-model:show="showSeatMgr" :seat-info="curSeatInfo" />

    <div class="effect" :style="{ display: showEffect ? 'block' : 'none' }">
      <img ref="effectContainer" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
    <chat-input-bar room-id="" />

  </van-col>
</template>
<script lang="ts" setup>
import parseAPNG from 'apng-js'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Chatroom, IM } from '../../models'
import { useChatroomStore, useCommonStore } from '../../store'
import ChatInputBar from './ChatInputBar.vue'
import ChatroomMessage from './ChatroomMessage.vue'
import Seat from './Seat.vue'
import SeatMgr from './SeatMgr.vue'

const route = useRoute()
const commonStore = useCommonStore()
const chatroomStore = useChatroomStore()

const effectContainer = ref<HTMLImageElement>()
// const room = ref<Chatroom.Room>(null)
const showRoomInfo = ref(false)
const showSeatMgr = ref(false)
const showSeatPanel = ref('1')
const offsetHeight = ref(160)
const seats = ref<Array<Chatroom.Seat>>([])
const messages = ref<Array<IM.Message>>([])
const curSeatInfo = ref<Chatroom.Seat>(null)
const curEffect = ref<string>(null)
const showEffect = ref(false)

let roomId: string = null
let isMyRoom = false
let isStared = false

onMounted(async () => {
  commonStore.navbar.title = chatroomStore.curRoom.title
  commonStore.navbarBg = 'linear-gradient(0.5turn, #0d79c6, #0f5383, #0a3d62)'
  commonStore.navbarColor = 'white'
  commonStore.navbar.rightText = isMyRoom ? 'icon-info' : (isStared ? 'icon-star-select' : 'icon-star')
  commonStore.rightAction = () => {
    if (isMyRoom) {
      showRoomInfo.value = true
    } else {
      isStared = !isStared
      commonStore.navbar.rightText = isStared ? 'icon-star-select' : 'icon-star'
    }
  }

  mockMessages()

  setTimeout(() => { showSeatPanel.value = null }, 3000)

  await playGiftEffect()
})

watch(showSeatPanel, () => {
  if (showSeatPanel.value == '1') {
    offsetHeight.value = 360
  } else {
    offsetHeight.value = 160
  }
})

watch(chatroomStore.effects, () => {
  curEffect.value = chatroomStore.effects.shift()
})

async function playGiftEffect() {
  let img = await fetch('https://yppphoto.hellobixin.com/4d769c3857a8430f845d3aa4bf458817.png')
  let blob = await img.blob()
  let buf = await blob.arrayBuffer()
  let apng = parseAPNG(buf)
  if (apng instanceof Error) {

  } else {
    showEffect.value = true
    effectContainer.value.src = URL.createObjectURL(blob)

    setTimeout(() => {
      if (effectContainer.value) {
        effectContainer.value.src = ''
        showEffect.value = false
      }
    }, apng.playTime)
  }
}

function mockMessages() {
  for (let i = 0; i < 20; ++i) {
    messages.value.push({
      sid: '',
      uid: 'string',
      timestamp: new Date().getTime(),
      type: IM.MessageType.TEXT,
      content: `hello world ${i}`
    })
  }
}

</script>

<style scoped>
.nav-bar-bg {
  background: linear-gradient(0.5turn, #0a3d62, #0f5383, #0d79c6);
}

.van-cell::after,
[class*='van-hairline']::after {
  display: none;
}

.top-panel {
  background: linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c);
}

.effect {
  width: 100%;
  height: calc(100% - 60px);
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
</style>