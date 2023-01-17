<template>
  <van-popup :show="show" position="bottom" round @close="emits('update:show', false)">

    <template v-if="seatInfo.userInfo">
      <div class="seat-box" style="margin-top: 15px;">
        <van-image class="seat-item-avatar" fit="cover" round radius="36"
          :src="`//${commonStore.appConfig?.staticServer + seatInfo.userInfo.avatar}`" />
        <span class="seat-item-mute iconfont icon-mute" v-if="(seatInfo && seatInfo.isMute)"></span>
      </div>
      <div class="seat-item-name">
        {{ seatInfo.userInfo.name }}
      </div>

      <div v-if="isMaster || isMyself" style="text-align: center; margin: 15px;">
        <van-button plain type="warning" size="small" @click="mute">
          <template #icon>
            <van-icon class="iconfont" :class="seatInfo.isMute ? 'icon-volume' : 'icon-mute'" />
          </template>
        </van-button>
        <van-button plain type="danger" size="small" style="margin: 0 10px;" @click="seatDown"
          :text="$t(isMyself ? 'square.room.seatMgr.downSelf' : 'square.room.seatMgr.down')">
        </van-button>
      </div>
    </template>
    <template v-else>
      <van-row style="padding: 5px; font-size: 0.9rem; color: #bdc3c7; margin-left: 10px;" justify="space-between">
        <div style="margin: auto 0;">{{ seatInfo.seq }}号麦</div>
        <van-row>
          <van-button v-if="isMaster" plain type="danger" size="small" @click="lock">
            <template #icon>
              <van-icon class="iconfont" :class="seatInfo.isLocked ? 'icon-unlock' : 'icon-lock'" />
            </template>
          </van-button>

          <van-button v-if="isMaster || isMyself" plain type="warning" size="small" @click="mute"
            style="margin: 0 10px;">
            <template #icon>
              <van-icon class="iconfont" :class="seatInfo.isMute ? 'icon-volume' : 'icon-mute'" />
            </template>
          </van-button>
        </van-row>
      </van-row>
      <van-list style="width:100%; height: 240px; overflow-y: auto;">
        <van-cell :title="item.name" :label="`[${item.seatSeq}号麦] \t \t ${$d(new Date(item.timestamp), 'short')}`"
          v-for="item in seatReqs" clickable>
          <template #value>
            <van-button plain type="primary" size="small" :text="$t('square.room.seatMgr.on')" v-if="isMaster"
              @click="allowSeatOn(item)" />
            <van-button v-if="item.uid == commonStore.profile.uid" plain type="warning" size="small"
              :text="$t('common.cancel')" style="margin-left: 15px;" @click="seatOnReqCancel" />
          </template>
        </van-cell>
      </van-list>
      <van-button type="primary" style="width: calc(100% - 30px); margin: 15px;" @click="seatOnReq"
        :disabled="seatInfo.isLocked"
        :text="$t(isMaster ? 'square.room.seatMgr.onDirectly' : 'square.room.seatMgr.request')" />
    </template>
  </van-popup>
</template>
<script lang="ts" setup>
import { showToast } from 'vant';
import { onMounted, ref, watch } from 'vue';
import { Chatroom, ChatroomApi, User } from '../../../models';
import { useChatroomStore, useCommonStore } from '../../../store';

const props = defineProps<{
  show: boolean,
  seatInfo: Chatroom.Seat
}>()

const emits = defineEmits(['update:show'])

const commonStore = useCommonStore()
const chatroomStore = useChatroomStore()
const seatReqs = ref<Array<Chatroom.SeatReq & User.Profile>>([])

const isMyself = ref(false)
let isMaster = false

onMounted(async () => {
  // seatReqs.value = await ChatroomApi.seatRequests(chatroomStore.curRoom?._id)
  isMaster = chatroomStore.isMaster(commonStore.profile?.uid)
})

watch(() => props.show, async () => {
  if (!props.show) return

  if (props.seatInfo.userInfo == null) {
    seatReqs.value = await ChatroomApi.seatRequests(chatroomStore.curRoom._id)
    isMyself.value = false
  } else {
    isMyself.value = props.seatInfo.userInfo.uid == commonStore.profile?.uid
  }
})

async function mute() {
  await chatroomStore.mute(props.seatInfo)
  emits('update:show', false)
}

async function lock() {
  await chatroomStore.lock(props.seatInfo)
  emits('update:show', false)
}

async function allowSeatOn(item: Chatroom.SeatReq) {
  await chatroomStore.allowSeatOn(item.uid, item.seatSeq)
  seatReqs.value = await ChatroomApi.seatRequests(chatroomStore.curRoom._id)
  emits('update:show', false)
}
// 抱下麦 or 主动下麦
async function seatDown() {
  await chatroomStore.seatDown(props.seatInfo, commonStore.profile.uid)
  emits('update:show', false)
}

async function seatOnReq() {

  let isOnSeat = chatroomStore.isOnSeat(commonStore.profile.uid)
  if (isOnSeat) {
    showToast('您已经在麦上了，请先下麦')
    return
  }
  try {
    if (isMaster) {
      await chatroomStore.allowSeatOn(commonStore.profile.uid, props.seatInfo.seq)
    } else {
      await chatroomStore.seatOnReq(props.seatInfo, commonStore.profile.uid)
    }
  } catch (err) {
    showToast(err)
  }

  emits('update:show', false)
}

async function seatOnReqCancel() {
  await ChatroomApi.seatReq(chatroomStore.curRoom._id, props.seatInfo.seq, Chatroom.MsgType.SeatOnReqCancel)
  seatReqs.value = await ChatroomApi.seatRequests(chatroomStore.curRoom._id)
  emits('update:show', false)
}


</script>
<style scoped>

</style>