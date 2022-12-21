<template>
  <van-col style="width:100%; height: 100%; overflow-y: auto;">
    <van-tabs v-model:active="activeTab">
      <van-tab title="我的关注"></van-tab>
      <van-tab title="推荐"></van-tab>
    </van-tabs>
    <van-list style="width: 100%;" :finished="finished" @load="fetchList">
      <div class="list-box">
        <div class="list-item" v-for="(item, idx) of rooms" :key="idx" @click="enterRoom(item)">
          <img class="item-cover" v-if="item.cover" :src="item.cover" fit="cover" @load="calcImageHeight"
            @error="calcImageHeight" />
          <div class="item-text van-ellipsis">{{
              item.title
          }}</div>
          <div class="item-text van-multi-ellipsis--l2" style="font-size: 0.8rem; color: #bdc3c7;">
            {{ item.notice }}</div>
        </div>
      </div>
    </van-list>
    <create-room v-model:show="showCreateRoom" />
  </van-col>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { getScaleSize } from '../../common/image.util'
import { Channel } from '../../models'
import { ChatRoomApi } from '../../models/channel.api'
import { useCommonStore } from '../../store'
import CreateRoom from './CreateRoom.vue'

const commonStore = useCommonStore()
const router = useRouter()
const i18n = useI18n()
const channels = ref<Channel.Channel>([])
const rooms = ref<Array<Channel.Room>>([])

const activeTab = ref()
const showCreateRoom = ref(false)
const loading = ref(false)
const finished = ref(false)
const isMounted = ref(false)
const forUpdate = ref(0)
const isLimit = ref(false)

let isLoad = false

let ItemWidth = document.body.clientWidth / 2 - 20
let MaxHeight = 300

onMounted(async () => {
  commonStore.navbar.title = i18n.t('channel.title')
  commonStore.navbar.rightText = 'icon-plus'
  commonStore.rightAction = () => { showCreateRoom.value = true }
})

async function fetchList() {
  loading.value = true
  let newList = await ChatRoomApi.recommends()
  let tmpData = new Array<Channel.Room>(newList.length)
  for (let i = 0, j = Math.ceil(newList.length / 2); i < newList.length / 2; ++i, ++j) {
    tmpData[i] = newList[i * 2]
    if (j >= newList.length) break
    tmpData[j] = newList[i * 2 + 1]
  }
  loading.value = false
  rooms.value = rooms.value.concat(tmpData)
  if (rooms.value.length > 20) finished.value = true
}

async function enterRoom(item: Channel.Room) {
  router.push({ name: 'ChatRoom', params: { rid: item._id } })
}

function calcImageHeight(e: any) {
  let img = (e.target != null ? e.target : e.path[0]) as HTMLImageElement
  let item = img.parentElement
  if (e.type == 'load') {
    let [width, height] = getScaleSize(img.naturalWidth, img.naturalHeight, ItemWidth, MaxHeight)
    img.style.width = `${ItemWidth}px`
    img.style.height = `${height}px`
    item.style.height = `${height + 80}px`
  } else if (e.type == 'error') {
    img.style.opacity = '0'
    img.style.width = `${ItemWidth}px`
    img.style.height = `${ItemWidth}px`
    img.onerror = null
    item.style.height = `${ItemWidth + 80}px`
  }
}

</script>
<style lang="css" scoped>
.list-box {
  width: calc(100% - 30px);
  column-count: 2;
  column-gap: 10px;
  margin: 0 auto;
  padding: 10px 0;
}

.list-item {
  position: relative;
  border: 1px solid #efefef;
  border-radius: 8px;
  box-shadow: 0px 12px 8px -12px #000;
  box-sizing: border-box;
  background: white;
  -webkit-column-break-inside: avoid;
  break-inside: avoid;
  text-align: center;
  margin-bottom: 15px;
}

.list-item:active {
  scale: 0.98;
}

.item-cover {
  background-color: #e7e7e7;
  border: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.item-text {
  text-align: left;
  font-size: 0.9rem;
  color: #2c3e50;
  margin: 5px;
}
</style>