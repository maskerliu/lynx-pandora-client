<template>

  <van-col>
    <van-collapse v-model="showSeatPanel" accordion>
      <van-collapse-item name="1" style="background: transparent; padding:0;">
        <template #title>
          <van-row style="background: transparent;">
            <van-image round radius="8" width="4rem" height="4rem" />
            <div style="width: calc(100vw - 130px); padding: 5px 0 5px 15px;">
              {{ 'Vue也没那么难学嘛' }}
              <van-notice-bar background="#fff0" style="padding: 0;" left-icon="volume-o"
                text="无论我们能活多久，我们能够享受的只有无法分割的此刻，此外别无其他。" />
            </div>
          </van-row>
        </template>
        <van-row class="bg-border top-panel"
          style="border-top-left-radius: 0; border-top-right-radius: 0; background-color: transparent; margin-top: 0; padding: 15px 0;">
          <seat v-for="item in seats" :seat-info="item" />
        </van-row>
      </van-collapse-item>
    </van-collapse>

    <van-row :style="{ height: `calc(100% - ${offsetHeight}px)`, padding: '10px' }">
      <van-list style="flex: 1; height: 100%; overflow-y: auto;">
        <chat-room-message :message="item" v-for="item in messages" />
      </van-list>
      <van-col style="width: 100px;">
        活动
      </van-col>
    </van-row>

    <!-- <div style="width: 100%; height: calc(100% - 60px); position: absolute; top: 0; left: 0;">
      <video src="https://yvideo.eryufm.cn/video/bc855ed260574428a080433d3358c654.mp4" controls  style="width: 100%; height: 100%;"/>
    </div> -->

    <chat-input-bar room-id="" />



  </van-col>
</template>
<script lang="ts" setup>
import { onMounted, watch, ref } from 'vue'
import { Channel, IM } from '../../models'
import { useChannelStore, useCommonStore } from '../../store'
import ChatInputBar from './ChatInputBar.vue'
import ChatRoomMessage from './ChatRoomMessage.vue'
import Seat from './Seat.vue'

const commonStore = useCommonStore()
const channelStore = useChannelStore()

const showRoomInfo = ref(false)
const showSeatPanel = ref('1')
const offsetHeight = ref(160)
const seats = ref<Array<Channel.Seat>>([])
const messages = ref<Array<IM.Message>>([])
let isMyRoom = false
let isStared = false

onMounted(() => {

  commonStore.navbar.title = 'Vue交流'
  commonStore.navbar.rightText = isMyRoom ? 'icon-info' : (isStared ? 'icon-star-select' : 'icon-star')
  commonStore.rightAction = () => {
    if (isMyRoom) {
      showRoomInfo.value = true
    } else {
      isStared = !isStared
      commonStore.navbar.rightText = isStared ? 'icon-star-select' : 'icon-star'
    }
  }

  mockSeats()
  mockMessages()

  setTimeout(() => { showSeatPanel.value = null }, 3000)

})

watch(showSeatPanel, () => {
  if (showSeatPanel.value == '1') {
    offsetHeight.value = 360
  } else {
    offsetHeight.value = 160
  }
})

function mockSeats() {
  seats.value.push({
    seq: 0,
    type: Channel.SeatType.Guest,
    isMute: false,
    isLocked: false,
    userInfo: { name: 'zhangsan' }
  })

  seats.value.push({
    seq: 1,
    type: Channel.SeatType.Guest,
    isMute: false,
    isLocked: false,
    userInfo: { name: '里斯' }
  })

  seats.value.push({
    seq: 2,
    type: Channel.SeatType.Guest,
    isMute: true,
    isLocked: false,
    userInfo: { name: 'zhangsan' }
  })

  seats.value.push({
    seq: 3,
    type: Channel.SeatType.Guest,
    isMute: false,
    isLocked: false,
    userInfo: { name: 'zhangsan' }
  })

  seats.value.push({
    seq: 4,
    type: Channel.SeatType.Guest,
    isMute: false,
    isLocked: false,
    userInfo: { name: 'zhangsan' }
  })

  seats.value.push({
    seq: 5,
    type: Channel.SeatType.Guest,
    isMute: false,
    isLocked: false,
  })

  seats.value.push({
    seq: 6,
    type: Channel.SeatType.Guest,
    isMute: false,
    isLocked: true,
  })

  seats.value.push({
    seq: 7,
    type: Channel.SeatType.Guest,
    isMute: false,
    isLocked: false,
  })
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
<style >
.top-panel {
  background: linear-gradient(94deg, rgba(192, 160, 105, 1), rgba(233, 214, 172, 1)) !important;
}
</style>