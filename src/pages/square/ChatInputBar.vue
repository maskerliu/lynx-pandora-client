<template>
  <van-field class="inputbar" v-model="textInput" :placeholder="$t('square.room.inputPlaceholder')" type="textarea"
    autosize rows="1" center clearable>
    <template #left-icon>
      <van-button round style="width: 35px; height: 35px; margin-right: 15px;">
        <template #icon>
          <van-icon class="iconfont icon-voice" size="24" />
        </template>
        <audio ref="audioRecord" autoplay></audio>
      </van-button>
    </template>
    <template #right-icon style="width: 100px;">

      <van-button type="success" plain @click="sendMessage(IM.MessageType.TEXT)"
        style="width: 45px; height: 30px; position: relative;">
        <template #icon>
          <van-icon class="iconfont icon-send" size="22" />
        </template>
      </van-button>

      <van-popover placement="top-end" v-model:show="showEmojiPanel" style="width: calc(100% - 30px);">
        <van-tabs v-model:active="activeTab">
          <van-tab title="Emoji">
            <!-- <emoji-picker class="emoji-panel" v-model:emoji="emoji" /> -->
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

      <gift-panel />

    </template>

  </van-field>
</template>
<script lang ="ts" setup>
import { UploaderFileListItem } from 'vant'
import { onMounted, ref, watch } from 'vue'
import { IM } from '../../models'
import { useCommonStore, useIMStore } from '../../store'
import GiftPanel from './GiftPanel.vue'

const props = defineProps<{
  roomId: string
}>()

const commonStore = useCommonStore()
const imStore = useIMStore()

const showEmojiPanel = ref(false)
const activeTab = ref(0)
const textInput = ref(null)
const emoji = ref('')
const image = ref<Array<UploaderFileListItem>>([])

let session: IM.Session = null

const matchNotEmpty = /[^\s]+/i


onMounted(async () => {
  if (window.argus) {
    window.webApp.register(onFileSelect)
  }

  // session = await imStore.session(props.roomId)
})

watch(emoji, () => {

  if (emoji) {
    textInput.value += emoji.value
  }

  showEmojiPanel.value = false
})

function openFileSelector() {
  if (window.argus) {
    window.argus.fileSelect(0, 1)
  }
}

async function sendMessage(type: IM.MessageType) {
  let file: File = null, content: string = null
  switch (type) {
    case IM.MessageType.TEXT:
    case IM.MessageType.EMOJI:
      const contentMatch = textInput.value.match(/^\s*((.|\n)+?)\s*$/i)
      if (matchNotEmpty.test(textInput.value) && contentMatch) {
        content = contentMatch[1]
      }
      break
    case IM.MessageType.IMAGE:
      file = image.value[0].file
      break
  }

  if (content == null && file == null) return

  let uid = commonStore.profile.uid
  let to = session.type == IM.SessionType.P2P ? session.members.filter(it => it != uid)[0] : null
  let msg: IM.Message = {
    sid: props.roomId.toString(),
    uid: commonStore.profile.uid,
    type, content, to,
    timestamp: new Date().getTime(),
    sent: 0,
    read: false,
  }

  await imStore.sendMessage(msg, file)
  textInput.value = null
  image.value.splice(0, 1)
  content = null
  file = null
}

async function onFileSelect(...args: string[]) {
  let resp = await fetch(args[0])
  let blob = await resp.blob()
  let file = new File([blob], 'test.jpeg', { type: blob.type })
  image.value.push({ file, content: args[0] })
  await sendMessage(IM.MessageType.IMAGE)
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