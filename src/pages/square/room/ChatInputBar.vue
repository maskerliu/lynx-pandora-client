<template>
  <van-field class="inputbar" v-model="textInput" :placeholder="$t('square.room.inputPlaceholder')" type="textarea"
    autosize rows="1" center clearable>
    <template #left-icon>
      <van-button style="width: 35px; height: 30px; margin-right: 15px; text-align: center;">
        <template #icon>
          <van-icon class="iconfont icon-room-setting" size="20" color="grey" />
        </template>
        <audio ref="audioRecord" autoplay></audio>
      </van-button>
    </template>
    <template #right-icon style="width: 100px;">
      <van-button type="success" plain @click="sendMessage(Chatroom.MsgType.ChatText)"
        style="width: 45px; height: 30px; position: relative;">
        <template #icon>
          <van-icon class="iconfont icon-send" size="22" />
        </template>
      </van-button>

      <emoji-panel />

      <van-button round style="width: 35px; height: 35px; margin-left: 10px;" @click="showPropStore = !showPropStore">
        <template #icon>
          <van-icon class="iconfont icon-prop-store" size="20" color="#f39c12" />
        </template>
      </van-button>

      <gift-panel />

      <van-popup position="bottom" v-model:show="showPropStore" style="width: 100%; height: 70%;">
        <prop-store />
      </van-popup>

    </template>
  </van-field>
</template>
<script lang ="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { Chatroom } from '../../../models'
import { useChatroomStore, useCommonStore } from '../../../store'
import EmojiPanel from './EmojiPanel.vue'
import GiftPanel from './GiftPanel.vue'
import PropStore from './PropStore.vue'

const commonStore = useCommonStore()
const chatroomStore = useChatroomStore()
const showPropStore = ref(false)
const textInput = ref(null)
const emoji = ref('')

onMounted(async () => {

})

watch(emoji, () => {
  if (emoji) {
    textInput.value += emoji.value
  }
})

async function sendMessage(type: Chatroom.MsgType) {
  await chatroomStore.sendMessage(textInput.value, type, commonStore.profile)
  textInput.value = null
}

</script>
<style scoped>
.inputbar {
  width: 100%;
  position: absolute;
  bottom: 0;
  background: #ffffffcc;
}

.emoji-panel {
  overflow-x: hidden;
  overflow-y: auto;
  max-width: calc(100% - 30px);
  min-width: 345px;
  height: 320px;
  padding: 15px 0;
}
</style>