<template>
  <div class="feed-item" :key="room._id" @click="enterRoom(room)">
    <img class="item-frame" src="https://yppphoto.hibixin.com/yppphoto/e3e10912ee3847b0a2af20e6ec848fa2.apng" />
    <img v-if="room.cover" class="item-cover" fit="cover" @load="calcImageHeight" @error="calcImageHeight"
      :src="'//' + commonStore.appConfig?.staticServer + room.cover" />
    <div class="item-info">
      <div class="item-text van-ellipsis">
        {{ room.title }}
      </div>
      <div class="item-text van-ellipsis" style="font-size: 0.8rem; color: #bdc3c7;">
        {{ room.notice }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { showToast } from 'vant'
import { inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Chatroom } from '../../models'
import { useChatroomStore, useCommonStore } from '../../store'
import { CalcSquareFeedHeight } from '../components/misc'


defineProps<{
  room: Chatroom.Room
}>()

const calcImageHeight = inject(CalcSquareFeedHeight)
const router = useRouter()
const commonStore = useCommonStore()
const chatroomStore = useChatroomStore()

onMounted(() => {

})

async function enterRoom(item: Chatroom.Room) {
  try {
    await chatroomStore.enterRoom(item?._id)
    router.push({ name: 'Chatroom' })
  } catch (err) {
    showToast(err.toString())
  }
}

</script>
<style scoped>
.item-frame {
  position: absolute;
  width: 100%;
}

.item-cover {
  background-color: #e7e7e7;
  border: 0;
  border-radius: 8px;
}

.item-info {
  position: absolute;
  width: 100%;
  height: 50px;
  border-radius: 0 25px 8px 8px;
  background-color: #34495ec8;
  left: 0;
  right: 0px;
  bottom: 0px;
  text-align: left;
  font-size: 0.9rem;
  color: #ecf0f1;
}

.item-text {
  margin: 2px 0 0 5px;
}
</style>