<template>
  <div class="room-item" :key="room._id" @click="enterRoom(room)">
    <img src="https://yppphoto.hibixin.com/yppphoto/e3e10912ee3847b0a2af20e6ec848fa2.apng"
      style="position:absolute; width: 100%;" />
    <img v-if="room.cover" class="item-cover" fit="cover" @load="calcImageHeight" @error="calcImageHeight"
      :src="'//' + commonStore.appConfig.staticServer + room.cover" />

    <div class="item-info">
      <div class="item-text van-ellipsis">
        {{ room.title }}
      </div>
      <div class="item-text van-ellipsis" style="font-size: 0.7rem; color: #bdc3c7;">
        {{ room.notice }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { showToast } from 'vant'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getScaleSize } from '../../common/image.util'
import { Chatroom } from '../../models'
import { useChatroomStore, useCommonStore } from '../../store'


defineProps<{
  room: Chatroom.Room
}>()


const router = useRouter()
const commonStore = useCommonStore()
const chatroomStore = useChatroomStore()

const ItemWidth = document.body.clientWidth / 2 - 20
const MaxHeight = 300

onMounted(() => {

})

async function enterRoom(item: Chatroom.Room) {
  try {
    await chatroomStore.enterRoom(item._id)
    router.push({ name: 'Chatroom' })
  } catch (err) {
    showToast(err.toString())
  }
}

function calcImageHeight(e: any) {
  let img = (e.target != null ? e.target : e.path[0]) as HTMLImageElement
  let item = img.parentElement
  if (e.type == 'load') {
    let [_, height] = getScaleSize(img.naturalWidth, img.naturalHeight, ItemWidth, MaxHeight)
    img.style.width = `${ItemWidth}px`
    img.style.height = `${height}px`
    item.style.height = `${height}px`
  } else if (e.type == 'error') {
    img.style.opacity = '0'
    img.style.width = `${ItemWidth}px`
    img.style.height = `${ItemWidth}px`
    img.onerror = null
    item.style.height = `${ItemWidth}px`
  }
}


</script>
<style scoped>
.room-item {
  position: relative;
  border: 0px solid #efefef;
  border-radius: 8px;
  box-shadow: 0px 12px 8px -12px #000;
  box-sizing: border-box;
  background: white;
  -webkit-column-break-inside: avoid;
  break-inside: avoid;
  text-align: center;
  margin-bottom: 15px;
}

.room-item:active {
  scale: 0.98;
}

.item-cover {
  background-color: #e7e7e7;
  border: 0;
  border-radius: 8px;
  /* border-top-left-radius: 8px;
  border-top-right-radius: 8px; */
}

.item-info {
  width: 100%;
  height: 50px;
  border-radius: 0 25px 8px 8px;
  background-color: #34495ec8;
  position: absolute;
  left: 0;
  right: -2px;
  bottom: -2px;
}

.item-text {
  text-align: left;
  font-size: 0.8rem;
  color: #ecf0f1;
  margin: 5px;
}
</style>