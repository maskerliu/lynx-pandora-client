<template>

  <van-col :style="{
    background: `${chatroomStore.curRoom?.background ? 'url(' + chatroomStore.curRoom?.background + ')' : '#0a3d62'}`,
    backgroundSize: 'cover',
    height: '100%'
  }">
    <van-row justify="space-between" style="padding: 5px 0;">
      <van-col class="room-info">
        <van-image round radius="1.25rem" width="2.5rem" height="2.5rem" fit="cover" style="margin:auto 0;"
          :src="commonStore.appConfig ? `//${commonStore.appConfig?.staticServer + chatroomStore.curRoom?.cover}` : ''" />
        <div style="width: calc(100% - 80px); padding: 5px 15px;">
          {{ chatroomStore.curRoom?.title }}
          <div class="van-ellipsis" style="font-size: 0.6rem; color: burlywood; margin-top: 5px;">
            {{ chatroomStore.curRoom?.ownerName }}
          </div>
        </div>
      </van-col>

      <van-col>
        <template v-if="chatroomStore.curRoom?.owner == commonStore.profile?.uid">
          <van-icon class="iconfont icon-info" size="20" color="white" style="padding: 5px; margin: 10px;"
            @click="showRoomInfo = true" />
        </template>
        <template v-else>
          <van-icon class="iconfont" :class="isStared ? 'icon-star-select' : 'icon-star'" size="20" color="#f39c12"
            style="padding: 5px; margin: 10px;" @click="collectRoom" />
        </template>

        <van-icon class="iconfont icon-minimize" size="20" color="white"
          style="font-weight: bold; padding: 5px; margin: 10px 0;" />

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
        <room-message :message="item" v-for="item in chatroomStore.messages" />
      </van-list>
      <van-col style="width: 100px; height: 200px; background: #1817177d; border-radius: 15px; color: #ecf0f1;">
        活动
      </van-col>
    </van-row>

    <room-info v-model:show="showRoomInfo" :room="chatroomStore.curRoom" />
    <seat-mgr v-model:show="showSeatMgr" :seat-info="curSeatInfo" />

    <van-col ref="enterEffect" class="enter-msg animate__animated"
      v-bind:class="doEnter ? 'animate__bounceInLeft' : 'animate__fadeOut'" :style="{
        borderImageSource: enterMsg ? `url('//${commonStore.appConfig?.staticServer}${enterMsg?.userInfo.enterEffect}')` : '',
      }">
      <div style="margin: 22px; color: white; font-size: 0.8rem;">{{ enterMsg? `${enterMsg?.userInfo.name} 来啦`: '' }}
      </div>
    </van-col>

    <div class="gift-effect" :style="{ display: showEffect ? 'block' : 'none' }">
      <img ref="effectContainer" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>

    <room-input-bar />
  </van-col>
</template>
<script lang="ts" setup>
import parseAPNG from 'apng-js'
import { inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { Chatroom, ChatroomApi } from '../../../models'
import { useChatroomStore, useCommonStore } from '../../../store'
import { NavBack } from '../../components/misc'
import RoomInputBar from './RoomInputBar.vue'
import RoomMessage from './RoomMessage.vue'
import RoomInfo from './RoomInfo.vue'
import SeatMgr from './SeatMgr.vue'
import DianTaiSeatsPanel from './seats/DianTaiSeatsPanel.vue'
import JiaoYouSeatsPanel from './seats/JiaoYouSeatsPanel.vue'
import YuleSeatsPanel from './seats/YuleSeatsPanel.vue'


const navBack = inject(NavBack)

const commonStore = useCommonStore()
const chatroomStore = useChatroomStore()

const isStared = ref(false)
const msgContainer = ref()
const effectContainer = ref<HTMLImageElement>()
const showRoomInfo = ref(false)
const showSeatMgr = ref(false)
const offsetHeight = ref(325)
const curSeatInfo = ref<Chatroom.Seat>(null)
const enterEffect = ref()
const doEnter = ref(false)
const enterMsg = ref<Chatroom.Message>(null)
const showEffect = ref(false)

let timer = null

onMounted(() => {

  isStared.value = chatroomStore.curRoom?.isStared
  offsetHeight.value = chatroomStore.curRoom?.notice ? 365 : 325
  timer = setInterval(async () => {
    await playGiftEffect()
    await playEnterEffect()
  }, 200)

  enterEffect.value?.$el.addEventListener('animationend', () => {
    doEnter.value = false
    enterMsg.value = null
  })
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

  let effect = chatroomStore.giftEffect(effectMsg.giftId)
  if (effect == null) return

  let img = await fetch(`//${commonStore.appConfig?.staticServer + effect}`)
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

async function playEnterEffect() {

  if (doEnter.value) return

  enterMsg.value = chatroomStore.enterMsgs.shift()
  doEnter.value = enterMsg.value != null
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

async function minimize() {
  // TODO
}

async function leaveRoom() {
  await chatroomStore.leaveRoom()
  navBack()
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

.gift-effect {
  width: 100%;
  height: calc(100% - 60px);
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  font-style: italic;
  font-weight: bold;
}

.enter-msg {
  position: absolute;
  top: 35%;
  left: 0;
  width: 180px;
  height: 60px;
  border-image-slice: 0 fill;
}
</style>