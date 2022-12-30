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

      <div style="text-align: center; margin: 15px;">
        <van-button plain type="warning" size="small" :text="$t('square.room.seatMgr.mute')" @click="mute" />
        <van-button plain type="danger" size="small" :text="$t('square.room.seatMgr.down')" @click="seatDown"
          v-if="chatroomStore.curRoom?.masters?.includes(commonStore.profile.uid) || seatInfo.userInfo.uid == commonStore.profile.uid" />
      </div>
    </template>
    <template v-else>
      <div style="padding: 5px; font-size: 0.9rem; color: #bdc3c7; margin-left: 10px;">{{ $t('square.room.seatMgr.title') }}</div>
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
        :text="$t(chatroomStore.curRoom?.masters?.includes(commonStore.profile.uid) ? 'square.room.seatMgr.onDirectly' : 'square.room.seatMgr.request')" />
    </template>
  </van-popup>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
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

async function mute() {

}

async function allowSeatOn(item: Chatroom.SeatReq) {
  await ChatroomApi.seatMgr(chatroomStore.curRoom._id, item.uid, item.seatSeq, Chatroom.MsgType.SeatOn)
  emits('update:show', false)
}
// 抱下麦
async function seatDown() {
  await ChatroomApi.seatMgr(chatroomStore.curRoom._id, props.seatInfo.userInfo.uid, props.seatInfo.seq, Chatroom.MsgType.SeatDown)
}

async function seatReq() {
  if (chatroomStore.curRoom?.masters?.includes(commonStore.profile.uid)) { // 有权限直接上麦
    await ChatroomApi.seatMgr(chatroomStore.curRoom._id, commonStore.profile.uid, props.seatInfo.seq, Chatroom.MsgType.SeatOn)
  } else { // 发送上麦请求
    await ChatroomApi.seatOpt(chatroomStore.curRoom._id, props.seatInfo.seq, Chatroom.MsgType.SeatReq)
  }
}

async function seatReqCancel() {
  await ChatroomApi.seatOpt(chatroomStore.curRoom._id, props.seatInfo.seq, Chatroom.MsgType.SeatReqCancel)
}


</script>
<style scoped>

</style>