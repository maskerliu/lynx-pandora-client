<template>
  <van-col style="width:100%; height: 100%; overflow-y: auto;">
    <van-tabs v-model:active="activeTab" sticky shrink animated background="#f6f6f6">
      <van-tab title="我的关注">
        <van-list style="height: 100%; overflow-y: auto;" :loading="collectionLoading" :finished="collectionFinished"
          @load="getMyCollections">
          <template v-if="myCollections.length == 0">
            <div
              style="width:100%; height: 100%; margin-top: 50%; text-align: center; color: #bdc3c7; font-size: 0.7rem;">
              <van-icon class="iconfont icon-emptybox" size="50" />
              <div style="margin-top: 10px;">空空如野，快去收藏您喜欢的频道吧～～</div>
            </div>
          </template>
          <van-cell :title="room.title" :label="room.ownerName" v-for="room in myCollections" clickable @click="enterRoom(room)">
            <template #icon>
              <van-image :src="room.cover" width="4rem" height="4rem" round radius="8px" style="margin-right: 15px;" />
            </template>
          </van-cell>
        </van-list>
      </van-tab>
      <van-tab title="推荐">
        <van-list :loading="loading" :finished="finished" @load="fetchList">
          <div class="list-box">
            <div class="list-item" v-for="(item, idx) of rooms" :key="idx" @click="enterRoom(item)">
              <img src="https://yppphoto.hibixin.com/yppphoto/e3e10912ee3847b0a2af20e6ec848fa2.apng"
                style="position:absolute; width: 100%;" />
              <img class="item-cover" v-if="item.cover" :src="item.cover" fit="cover" @load="calcImageHeight"
                @error="calcImageHeight" />

              <div class="item-info">
                <div class="item-text van-ellipsis">
                  {{ item.title }}
                </div>
                <div class="item-text van-ellipsis" style="font-size: 0.7rem; color: #bdc3c7;">
                  {{ item.notice }}</div>
              </div>
            </div>
          </div>
        </van-list>
      </van-tab>
    </van-tabs>
  </van-col>
</template>
<script lang="ts" setup>
import { showToast } from 'vant'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { getScaleSize } from '../../common/image.util'
import { Chatroom } from '../../models'
import { ChatroomApi } from '../../models/chatroom.api'
import { useChatroomStore, useCommonStore } from '../../store'


const commonStore = useCommonStore()
const chatroomStore = useChatroomStore()
const router = useRouter()
const i18n = useI18n()
const myCollections = ref<Array<Chatroom.Room>>([])
const rooms = ref<Array<Chatroom.Room>>([])

const activeTab = ref(0)
const loading = ref(false)
const finished = ref(false)
const collectionLoading = ref(false)
const collectionFinished = ref(false)

const ItemWidth = document.body.clientWidth / 2 - 20
const MaxHeight = 300

let originData: Array<Chatroom.Room> = []

onMounted(async () => {
  commonStore.navbar.title = i18n.t('square.title')
  commonStore.navbar.leftArrow = false

  activeTab.value = 1
})

async function getMyCollections() {
  collectionLoading.value = true
  let collections = await ChatroomApi.myCollections()
  myCollections.value.push(...collections)
  collectionLoading.value = false
  collectionFinished.value = true
}

async function fetchList() {
  loading.value = true
  let newList = await ChatroomApi.recommends()
  originData.push(...newList)
  let tmpData = new Array<Chatroom.Room>(originData.length)
  for (let i = 0, j = Math.ceil(originData.length / 2); i < originData.length / 2; ++i, ++j) {
    tmpData[i] = originData[i * 2]
    if (j >= originData.length) break
    tmpData[j] = originData[i * 2 + 1]
  }
  loading.value = false
  rooms.value = tmpData
  if (rooms.value.length > 20) finished.value = true
}

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
    let [width, height] = getScaleSize(img.naturalWidth, img.naturalHeight, ItemWidth, MaxHeight)
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

.list-item:active {
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