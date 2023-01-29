<template>
  <span>
    <van-button round style="width: 35px; height: 35px; margin-left: 10px;" @click="showEmojiPanel = !showEmojiPanel">
      <template #icon>
        <van-icon class="iconfont icon-emoji" size="24" color="#d35400" />
      </template>
    </van-button>

    <van-popup position="bottom" v-model:show="showEmojiPanel" style="width: 100%; height: 300px;">
      <van-tabs v-model:active="activeTab" shrink >
        <van-tab :title="group.name" v-for="group in emojis">
          <template v-if="group.type == EmojiType.Text">
            <van-grid :column-num="6" clickable :gutter="10" :border="false" style="margin-top: 10px; padding: 0;"
              v-for="(emojiGroup, category) in group.emojis">
              <van-grid-item v-for="(emoji, emojiName) in emojiGroup">
                <span style="font-size: 1.8rem; padding: 10px;">{{ emoji }}</span>
              </van-grid-item>
            </van-grid>
          </template>
          <template v-else-if="group.type == EmojiType.Custom">
            <van-grid :column-num="5" clickable :gutter="10" :border="false" style="margin-top: 10px;">
              <van-grid-item v-for="item in group.emojis" @click="sendEmoji(item)">
                <van-image width="3rem" height="3rem" :src="`//${commonStore.appConfig?.staticServer + item.snap}`" />
              </van-grid-item>
            </van-grid>
          </template>
        </van-tab>
      </van-tabs>
    </van-popup>
  </span>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { IM, IMApi } from '../../models';
import { useCommonStore, useIMStore } from '../../store';
import TxtEmojis from './emojis'

enum EmojiType {
  Text,
  Custom
}

type IMEmojiGroup = {
  name: string
  type: EmojiType
  emojis: any | Array<IM.IMEmoji>
}

const commonStore = useCommonStore()
const imStore = useIMStore()
const showEmojiPanel = ref(false)
const activeTab = ref(0)
const emojis = ref<Array<IMEmojiGroup>>([])

onMounted(async () => {
  console.log(Object.keys(TxtEmojis))
  Object.keys(TxtEmojis).map(it => {
    let sets = TxtEmojis[it]
    console.log(sets)
  })

  // let txtEmojis= TxtEmojis.map(it=>{
  //   console.log(it)
  // })

  emojis.value.push({ name: '通用', type: EmojiType.Text, emojis: TxtEmojis })
  emojis.value.push({ name: '我的', type: EmojiType.Custom, emojis: await imStore.myEmojis() })
})

async function sendEmoji(item: IM.IMEmoji) {
  // await chatroomStore.sendMessage(item.gif, Chatroom.MsgType.ChatEmoji, commonStore.profile)
  showEmojiPanel.value = false
}

</script>
<style scoped>

</style>