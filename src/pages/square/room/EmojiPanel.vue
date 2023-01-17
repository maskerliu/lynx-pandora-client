<template>
  <span>
    <van-button round style="width: 35px; height: 35px; margin-left: 10px;" @click="showEmojiPanel = !showEmojiPanel">
      <template #icon>
        <van-icon class="iconfont icon-emoji" size="24" color="#d35400" />
      </template>
    </van-button>

    <van-popup position="bottom" v-model:show="showEmojiPanel" style="width: 100%; height: 300px;">
      <van-tabs v-model:active="activeTab" shrink>
        <van-tab :title="group.name" v-for="group in emojis">
          <van-grid :column-num="5" clickable :gutter="10" :border="false" style="margin-top: 10px;">
            <van-grid-item v-for="item in group.emojis" @click="sendEmoji(item)">
              <van-image :src="`//${commonStore.appConfig?.staticServer}${item.snap}`" width="3rem" height="3rem" />
            </van-grid-item>
          </van-grid>
        </van-tab>
      </van-tabs>
    </van-popup>
  </span>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { Chatroom, ChatroomApi } from '../../../models';
import { useChatroomStore, useCommonStore } from '../../../store';

const commonStore = useCommonStore()
const chatroomStore = useChatroomStore()
const showEmojiPanel = ref(false)
const activeTab = ref(0)
const emojis = ref<Array<Chatroom.EmojiGroup>>([])

onMounted(async () => {
  emojis.value = await ChatroomApi.emojis()
})

async function sendEmoji(item: Chatroom.Emoji) {
  await chatroomStore.sendMessage(item.gif, Chatroom.MsgType.ChatEmoji, commonStore.profile)
  showEmojiPanel.value = false
}

</script>
<style scoped>

</style>