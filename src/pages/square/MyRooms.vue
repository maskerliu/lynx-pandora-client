<template>
  <van-col>
    <van-list>
      <van-cell :title="room.title" :label="room.ownerName" v-for="room in myRooms" clickable @click="enterRoom(room)">
        <template #icon>
          <van-image :src="room.cover" width="4rem" height="4rem" round radius="8px" style="margin-right: 15px;" />
        </template>
      </van-cell>
    </van-list>
    <room-info v-model:show="showCreateRoom" />
  </van-col>
</template>
<script lang="ts" setup>
import { showToast } from 'vant'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Chatroom } from '../../models'
import { ChatroomApi } from '../../models/chatroom.api'
import { useChatroomStore, useCommonStore } from '../../store'
import RoomInfo from './RoomInfo.vue'

const i18n = useI18n()
const router = useRouter()
const commonStore = useCommonStore()
const chatroomStore = useChatroomStore()
const showCreateRoom = ref(false)
const myRooms = ref<Array<Chatroom.Room>>([])

onMounted(async () => {
  commonStore.navbar.title = i18n.t('square.myRooms.title')
  commonStore.navbar.rightText = 'icon-add'
  commonStore.rightAction = () => { showCreateRoom.value = true }

  myRooms.value = await ChatroomApi.myRooms()

})

async function enterRoom(room: Chatroom.Room) {
  try {
    await chatroomStore.enterRoom(room._id)
    router.push({ name: 'Chatroom' })
  } catch (err) {
    showToast(err.toString())
  }

}

</script>
<style scoped>

</style>