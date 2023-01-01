<template>
  <van-popup :show="show" @close="emits('update:show', false)" position="bottom" round style="height: 350px;">

    <template v-if="seatInfo.userInfo">
      <div class="seat-box" style="margin-top: 15px;">
        <van-image class="seat-item-avatar" :src="seatInfo.userInfo.avatar" fit="cover" round radius="36" />
        <span class="seat-item-mute iconfont icon-mute" v-if="(seatInfo && seatInfo.isMute)"></span>
      </div>
      <div class="seat-item-name">
        {{ seatInfo.userInfo.name }}
      </div>

      <div style="text-align: center; margin: 15px;"
        v-if="chatroomStore.curRoom?.masters?.includes(commonStore.profile.uid) || seatInfo.userInfo.uid == commonStore.profile.uid">
        <van-button plain type="warning" size="small" @click="mute">
          <template #icon>
            <van-icon class="iconfont" :class="seatInfo.isMute ? 'icon-volume' : 'icon-mute'" />
          </template>
        </van-button>
        <van-button plain type="danger" size="small" style="margin: 0 10px;"
          :text="$t(seatInfo.userInfo.uid == commonStore.profile.uid ? 'square.room.seatMgr.downSelf' : 'square.room.seatMgr.down')"
          @click="seatDown">
        </van-button>
      </div>
    </template>
    <template v-else>
      <van-row style="padding: 5px; font-size: 0.9rem; color: #bdc3c7; margin-left: 10px;" justify="space-between">
        <div style="margin: auto 0;">{{ seatInfo.seq }}号麦</div>
        <van-row>
          <van-button plain type="danger" size="small" @click="lock"
            v-if="chatroomStore.curRoom?.masters?.includes(commonStore.profile.uid)">
            <template #icon>
              <van-icon class="iconfont" :class="seatInfo.isLocked ? 'icon-unlock' : 'icon-lock'" />
            </template>
          </van-button>

          <van-button plain type="warning" size="small" @click="mute" style="margin: 0 10px;"
            v-if="chatroomStore.curRoom?.masters?.includes(commonStore.profile.uid) || seatInfo.userInfo?.uid == commonStore.profile.uid">
            <template #icon>
              <van-icon class="iconfont" :class="seatInfo.isMute ? 'icon-volume' : 'icon-mute'" />
            </template>
          </van-button>
        </van-row>
      </van-row>
      <van-list style="width:100%; height: 240px; overflow-y: auto;">
        <van-cell :title="item.name" :label="$d(new Date(item.timestamp), 'short')" v-for="item in seatReqs" clickable>
          <template #value>
            <van-button plain type="primary" size="small" :text="$t('square.room.seatMgr.on')"
              v-if="chatroomStore.curRoom?.masters?.includes(commonStore.profile.uid)" @click="allowSeatOn(item)" />
            <van-button plain type="warning" size="small" :text="$t('common.cancel')" style="margin-left: 15px;"
              v-if="item.uid == commonStore.profile.uid" @click="seatReqCancel" />
          </template>
        </van-cell>
      </van-list>
      <van-button type="primary" style="width: calc(100% - 30px); margin: 15px;" @click="seatReq"
        :disabled="seatInfo.isLocked"
        :text="$t(chatroomStore.curRoom?.masters?.includes(commonStore.profile.uid) ? 'square.room.seatMgr.onDirectly' : 'square.room.seatMgr.request')" />
    </template>
  </van-popup>
</template>
<script lang="ts" setup>
import { showToast } from 'vant';
import { onMounted, ref, watch } from 'vue';
import { Chatroom, ChatroomApi, User } from '../../models';
import { useChatroomStore, useCommonStore } from '../../store';

const props = defineProps<{
  show: boolean,
  seatInfo: Chatroom.Seat
}>()

const emits = defineEmits(['update:show'])

const commonStore = useCommonStore()
const chatroomStore = useChatroomStore()
const seatReqs = ref<Array<Chatroom.SeatReq & User.Profile>>([])


onMounted(async () => {
  seatReqs.value = await ChatroomApi.seatRequests(chatroomStore.curRoom._id)
})

watch(() => props.show, async () => {
  if (props.show && props.seatInfo.userInfo == null) {
    seatReqs.value = await ChatroomApi.seatRequests(chatroomStore.curRoom._id)
  }
})

async function mute() {
  await ChatroomApi.seatMgr(chatroomStore.curRoom._id, null, props.seatInfo.seq, props.seatInfo.isMute ? Chatroom.MsgType.SeatUnmute : Chatroom.MsgType.SeatMute)
  emits('update:show', false)
}

async function lock() {
  await ChatroomApi.seatMgr(chatroomStore.curRoom._id, null, props.seatInfo.seq, props.seatInfo.isLocked ? Chatroom.MsgType.SeatUnlock : Chatroom.MsgType.SeatLock)
  emits('update:show', false)
}

async function allowSeatOn(item: Chatroom.SeatReq) {
  await ChatroomApi.seatMgr(chatroomStore.curRoom._id, item.uid, item.seatSeq, Chatroom.MsgType.SeatOn)
  seatReqs.value = await ChatroomApi.seatRequests(chatroomStore.curRoom._id)
}
// 抱下麦 or 主动下麦
async function seatDown() {
  if (commonStore.profile.uid == props.seatInfo.userInfo.uid) {
    await ChatroomApi.seatReq(chatroomStore.curRoom._id, props.seatInfo.seq, Chatroom.MsgType.SeatDown)
  } else if (chatroomStore.curRoom?.masters?.includes(commonStore.profile.uid)) {
    await ChatroomApi.seatMgr(chatroomStore.curRoom._id, props.seatInfo.userInfo.uid, props.seatInfo.seq, Chatroom.MsgType.SeatDown)
  }
}

async function seatReq() {

  let isOnSeat = chatroomStore.curRoom?.seats.find(it => { return it.userInfo?.uid == commonStore.profile.uid }) != null
  if (isOnSeat) {
    showToast('您已经在麦上了，请先下麦')
    return
  }

  if (chatroomStore.curRoom?.masters?.includes(commonStore.profile.uid)) { // 有权限直接上麦
    await ChatroomApi.seatMgr(chatroomStore.curRoom._id, commonStore.profile.uid, props.seatInfo.seq, Chatroom.MsgType.SeatOn)
  } else { // 发送上麦请求
    await ChatroomApi.seatReq(chatroomStore.curRoom._id, props.seatInfo.seq, Chatroom.MsgType.SeatReq)
  }

  emits('update:show', false)
}

async function seatReqCancel() {
  await ChatroomApi.seatReq(chatroomStore.curRoom._id, props.seatInfo.seq, Chatroom.MsgType.SeatReqCancel)
  seatReqs.value = await ChatroomApi.seatRequests(chatroomStore.curRoom._id)

  emits('update:show', false)
}


</script>
<style scoped>

</style>