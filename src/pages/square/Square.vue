<template>
  <van-col style="width:100%; height: 100%; overflow-y: auto;">
    <van-tabs v-model:active="activeTab" sticky shrink animated background="#f6f6f6">
      <van-tab :title="$t('square.myCollections')">
        <van-list style="height: 100%; overflow-y: auto;" :loading="collectionLoading" :finished="collectionFinished"
          @load="getMyCollections">
          <template v-if="myCollections.length == 0">
            <div
              style="width:100%; height: 100%; margin-top: 50%; text-align: center; color: #bdc3c7; font-size: 0.7rem;">
              <van-icon class="iconfont icon-emptybox" size="50" />
              <div style="margin-top: 10px;">{{ $t('square.collectionEmptyTips') }}</div>
            </div>
          </template>
          <template v-else>
            <template v-for="item in myCollections">

              <template v-if="item.type == Square.SquareItemType.Room">
                <van-cell :title="(item.data as Chatroom.Room).title" :label="(item.data as Chatroom.Room).ownerName"
                  v-for="room in myCollections" clickable @click="enterRoom(room.data as Chatroom.Room)">
                  <template #icon>
                    <van-image width="4rem" height="4rem" round radius="8px" style="margin-right: 15px;"
                      :src="'//' + commonStore.appConfig?.staticServer + (item.data as Chatroom.Room).cover" />
                  </template>
                </van-cell>
              </template>
            </template>
          </template>

        </van-list>
      </van-tab>
      <van-tab :title="$t('square.recommend')">
        <van-list :loading="loading" :finished="finished" @load="fetchList">
          <div class="list-box">
            <template v-for="item of recommends">
              <square-room-item v-if="item.type == Square.SquareItemType.Room" :room="(item.data as Chatroom.Room)" />
              <square-moment-item v-else-if="item.type == Square.SquareItemType.Moment"
                :moment="(item.data as Timeline.Moment)" />
              <square-post-item v-else-if="item.type == Square.SquareItemType.Post"
                :post="(item.data as Timeline.Post)" />
            </template>
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
import { Chatroom, Square, SquareApi, Timeline } from '../../models'
import { useChatroomStore, useCommonStore } from '../../store'
import SquareMomentItem from './SquareMomentItem.vue'
import SquarePostItem from './SquarePostItem.vue'
import SquareRoomItem from './SquareRoomItem.vue'

const commonStore = useCommonStore()
const chatroomStore = useChatroomStore()
const router = useRouter()
const i18n = useI18n()
const myCollections = ref<Array<Square.SquareItem>>([])
const recommends = ref<Array<Square.SquareItem>>([])

const activeTab = ref(0)
const loading = ref(false)
const finished = ref(false)
const collectionLoading = ref(false)
const collectionFinished = ref(false)

const ItemWidth = document.body.clientWidth / 2 - 20
const MaxHeight = 300

let originData: Array<Square.SquareItem> = []

onMounted(async () => {
  commonStore.navbar.title = i18n.t('square.title')
  commonStore.navbar.leftArrow = false

  activeTab.value = 1
})

async function getMyCollections() {
  collectionLoading.value = true
  let collections = await SquareApi.myCollections()
  myCollections.value.push(...collections)
  collectionLoading.value = false
  collectionFinished.value = true
}

async function fetchList() {
  loading.value = true
  let newList = await SquareApi.recommends()
  originData.push(...newList)
  let tmpData = new Array<Square.SquareItem>(originData.length)
  for (let i = 0, j = Math.ceil(originData.length / 2); i < originData.length / 2; ++i, ++j) {
    tmpData[i] = originData[i * 2]
    if (j >= originData.length) break
    tmpData[j] = originData[i * 2 + 1]
  }
  loading.value = false
  recommends.value = tmpData
  if (recommends.value.length > 10) finished.value = true
}

async function enterRoom(item: Chatroom.Room) {
  try {
    await chatroomStore.enterRoom(item._id)
    router.push({ name: 'Chatroom' })
  } catch (err) {
    showToast(err.toString())
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
</style>