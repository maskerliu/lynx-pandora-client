<template>

  <van-col :style="{
    background: `${chatroomStore.curRoom?.background ? 'url(' + chatroomStore.curRoom?.background + ')' : '#0a3d62'}`,
    backgroundSize: 'cover',
    height: '100%'
  }">
    <van-row justify="space-between" style="padding: 5px 0;">
      <van-col class="room-info">
        <van-image round radius="1.25rem" width="2.5rem" height="2.5rem" fit="cover" style="margin:auto 0;"
          :src="'//' + commonStore.appConfig.staticServer + chatroomStore.curRoom?.cover" />
        <div style="width: calc(100% - 80px); padding: 5px 15px;">
          {{ chatroomStore.curRoom?.title }}
          <div class="van-ellipsis" style="font-size: 0.6rem; color: burlywood; margin-top: 5px;">
            {{ chatroomStore.curRoom?.ownerName }}
          </div>
        </div>
      </van-col>

      <van-col>
        <template v-if="chatroomStore.curRoom?.owner == commonStore.profile?.uid">
          <van-icon class="iconfont icon-info" size="20" color="white" style="padding: 5px; margin: 10px 0;"
            @click="showRoomInfo = true" />
        </template>
        <template v-else>
          <van-icon class="iconfont" :class="isStared ? 'icon-star-select' : 'icon-star'" size="20" color="#f39c12"
            style="padding: 5px; margin: 10px 0;" @click="collectRoom" />
        </template>

        <van-icon class="iconfont icon-shut-down" size="20" color="white" style="padding: 5px; margin: 10px;"
          @click="leaveRoom" />
      </van-col>
    </van-row>

    <template v-if="chatroomStore.curRoom?.type == Chatroom.RoomType.DianTai">
      <DianTaiSeatsPanel @seat-click="handleSeatClick" />
    </template>
    <template v-else-if="chatroomStore.curRoom?.type == Chatroom.RoomType.YuLe">
      <YuleSeatsPanel @seat-click="handleSeatClick" />
    </template>
    <template v-else-if="chatroomStore.curRoom?.type == Chatroom.RoomType.JiaoYou">
      <JiaoYouSeatsPanel @seat-click="handleSeatClick" />
    </template>

    <van-notice-bar v-if="chatroomStore.curRoom?.notice" background="#fff0" style="padding: 0; margin: 0 5px;"
      left-icon="volume-o" :text="chatroomStore.curRoom?.notice" />
    <van-row :style="{ height: `calc(100% - ${offsetHeight}px)`, padding: '0 5px' }">
      <van-list ref="msgContainer" style="flex: 1; height: 100%; overflow-y: auto;">
        <chatroom-message :message="item" v-for="item in chatroomStore.messages" />
      </van-list>
      <van-col style="width: 100px; height: 200px; background: #1817177d; border-radius: 15px; color: #ecf0f1;">
        活动
      </van-col>
    </van-row>

    <room-info v-model:show="showRoomInfo" :room="chatroomStore.curRoom" />
    <seat-mgr v-model:show="showSeatMgr" :seat-info="curSeatInfo" />

    <div class="effect" :style="{ display: showEffect ? 'block' : 'none' }">
      <img ref="effectContainer" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
    <chat-input-bar room-id="" />

  </van-col>
</template>
<script lang="ts" setup>
import parseAPNG from 'apng-js'
import { onMounted, onUnmounted, ref, watch, inject } from 'vue'
import { useRouter } from 'vue-router'
import { Chatroom, ChatroomApi } from '../../../models'
import { useChatroomStore, useCommonStore } from '../../../store'
import { NavBack } from '../../components/misc'
import ChatInputBar from './ChatInputBar.vue'
import ChatroomMessage from './ChatroomMessage.vue'
import RoomInfo from './RoomInfo.vue'
import SeatMgr from './SeatMgr.vue'
import DianTaiSeatsPanel from './seats/DianTaiSeatsPanel.vue'
import JiaoYouSeatsPanel from './seats/JiaoYouSeatsPanel.vue'
import YuleSeatsPanel from './seats/YuleSeatsPanel.vue'

const router = useRouter()
const commonStore = useCommonStore()
const chatroomStore = useChatroomStore()

const isStared = ref(false)
const msgContainer = ref()
const effectContainer = ref<HTMLImageElement>()
const showRoomInfo = ref(false)
const showSeatMgr = ref(false)
const offsetHeight = ref(325)
const curSeatInfo = ref<Chatroom.Seat>(null)
const showEffect = ref(false)

let timer = null

const back = inject(NavBack)
onMounted(async () => {

  isStared.value = chatroomStore.curRoom.isStared
  offsetHeight.value = chatroomStore.curRoom.notice ? 365 : 325
  timer = setInterval(async () => {
    await playGiftEffect()
  }, 200)
})

onUnmounted(() => {
  clearInterval(timer)
})

watch(chatroomStore.messages, () => {
  scrollToBottom(true)
})

async function playGiftEffect() {
  if (showEffect.value || chatroomStore.effects.length == 0) { return }

  let effectMsg = chatroomStore.effects.shift()
  let effect = chatroomStore.gifts[(effectMsg.data as Chatroom.RewardContent).giftId].effect

  let img = await fetch(effect)
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

function scrollToBottom(smooth: boolean) {
  msgContainer.value.$el.scrollTo({ top: msgContainer.value.$el.scrollHeight, behavior: smooth ? 'smooth' : null })
  // msgContainer.value.$el.scrollTo({ top: msgContainer.value.$el.scrollHeight })
}

function handleSeatClick(seat: Chatroom.Seat) {
  showSeatMgr.value = true
  curSeatInfo.value = seat
}

async function collectRoom() {
  await ChatroomApi.collect(chatroomStore.curRoom._id)
  isStared.value = !isStared.value
}

async function leaveRoom() {
  await chatroomStore.leaveRoom(commonStore.profile.uid)
  back()
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

.room-info {
  width: 200px;
  display: flex;
  background: #08070744;
  font-size: 0.8rem;
  color: white;
  border: 0;
  border-radius: 25px;
  box-shadow: 0px 12px 8px -12px #000;
  margin: 5px;
}

.effect {
  width: 100%;
  height: calc(100% - 60px);
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  font-style: italic;
  font-weight: bold;
}
</style>