<template>
  <van-field style="width: 100%; position: absolute; bottom: 0;" v-model="textInput" type="textarea" autosize rows="1"
    center clearable>
    <template #left-icon>
      <van-button round @click="onCall" style="width: 35px; height: 35px; margin-right: 15px;">
        <template #icon>
          <van-icon class="iconfont icon-voice" size="24" />
        </template>
      </van-button>
    </template>
    <template #right-icon>
      <van-button type="success" plain @click="sendMsg" style="width: 45px; height: 30px;  margin-left: 15px;">
        <template #icon>
          <van-icon class="iconfont" v-bind:class="textInput?.length == 0 ? 'icon-file' : 'icon-send'" size="22" />
        </template>
      </van-button>

      <van-popover placement="top-end" v-model:show="showEmojiPanel" style="width: calc(100% - 30px);">
        <van-tabs v-model:active="activeTab">
          <van-tab title="Emoji">
            <emoji-picker class="emoji-panel" v-model:emoji="emoji" />
          </van-tab>
          <van-tab title="标签 3">
            <div class="emoji-panel"></div>
          </van-tab>
        </van-tabs>

        <template #reference>
          <van-button round style="width: 35px; height: 35px; margin-left: 10px;">
            <template #icon>
              <van-icon class="iconfont icon-emoji" size="24" />
            </template>
          </van-button>
        </template>
      </van-popover>


    </template>
    <van-uploader ref="fileUploader" />
  </van-field>
</template>
<script lang ="ts" setup>
import type { UploaderInstance } from 'vant'
import { inject, ref, watch } from 'vue'
import { IM } from '../../models'
import { CommonStore, IMStore } from '../components/misc'
import EmojiPicker from './EmojiPicker.vue'

const props = defineProps<{
  sid: String
}>()

const commonStore = inject(CommonStore)
const imStore = inject(IMStore)
const showEmojiPanel = ref(false)
const activeTab = ref(0)
const textInput = ref(null)
const emoji = ref('')

const fileUploader = ref<UploaderInstance>()

watch(emoji, () => {
  if (emoji) {
    textInput.value += emoji.value
  }

  showEmojiPanel.value = false
})

function sendMsg() {
  const matchNotEmpty = /[^\s]+/i
  const contentMatch = textInput.value.match(/^\s*((.|\n)+?)\s*$/i)
  if (textInput.value && matchNotEmpty.test(textInput.value) && contentMatch) {
    let msg: IM.Message = {
      sid: props.sid.toString(),
      uid: commonStore.profile.uid,
      type: IM.MessageType.TEXT,
      content: contentMatch[1],
      timestamp: new Date().getTime(),
      sent: false,
      read: false
    }
    imStore.sendMessage(msg)
    textInput.value = null
  } else {
    console.log(fileUploader.value)
    fileUploader.value?.chooseFile()
  }
}

function onCall() {

}

</script>
<style scoped>
.emoji-panel {
  overflow-x: hidden;
  overflow-y: auto;
  max-width: calc(100% - 30px);
  min-width: 345px;
  height: 320px;
  padding: 15px 0;
}
</style>