<template>
  <van-field style="width: 100%; position: absolute; bottom: 0;" v-model="textInput" type="textarea" autosize rows="1"
    center clearable>
    <template #left-icon>
      <van-button round @touchstart.prevent="onVoice(true)" @touchend.prevent="onVoice(false)"
        @mousedown.prevent="onVoice(true)" @mouseup.prevent="onVoice(false)"
        style="width: 35px; height: 35px; margin-right: 15px;">
        <template #icon>
          <van-icon class="iconfont icon-voice" size="24" />
        </template>
        <audio ref="audioRecord" autoplay></audio>
      </van-button>
    </template>
    <template #right-icon>
      <van-uploader v-model="image" closeImagePreview :preview-image="false" v-if="textInput?.length == 0"
        :after-read="() => sendMessage(IM.MessageType.IMAGE)" @click-upload="openFileSelector">
        <van-button type="success" plain style="width: 45px; height: 30px;  margin-left: 15px; position: relative;">
          <template #icon>
            <van-icon class="iconfont icon-file" size="22" />
          </template>
        </van-button>
      </van-uploader>

      <van-button v-else type="success" plain @click="sendMessage(IM.MessageType.TEXT)"
        style="width: 45px; height: 30px;  margin-left: 15px; position: relative;">
        <template #icon>
          <van-icon class="iconfont icon-send" size="22" />
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

      <van-popup v-model:show="showVoiceRecording">
        <van-icon class="iconfont icon-voice" size="24" style="padding: 50px;" />
        <audio controls :src="audioRecord" />
      </van-popup>

    </template>

  </van-field>
</template>
<script lang ="ts" setup>
import { UploaderFileListItem } from 'vant'
import { onMounted, ref, watch } from 'vue'
import { IM, IMApi } from '../../models'
import { useCommonStore, useIMStore } from '../../store'
import EmojiPicker from './EmojiPicker.vue'

const props = defineProps<{
  sid: String
}>()

const commonStore = useCommonStore()
const imStore = useIMStore()

const showVoiceRecording = ref(false)
const showEmojiPanel = ref(false)
const activeTab = ref(0)
const textInput = ref(null)
const emoji = ref('')
const image = ref<Array<UploaderFileListItem>>([])
const audioRecord = ref<string>('')
let recorder: MediaRecorder
let audioFile: File = null

const matchNotEmpty = /[^\s]+/i


onMounted(async () => {
  if (window.argus) {
    window.webApp.register(onFileSelect)
  }

  let stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  recorder = new MediaRecorder(stream)

  if (recorder.state == 'recording') recorder.stop()

  let chunks = []

  recorder.onstart = () => {
    audioFile = null
    chunks = []
  }

  recorder.ondataavailable = (e) => {
    chunks.push(e.data)
  }

  recorder.onstop = async () => {
    let blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' })
    audioFile = new File([blob], 'test.wav',)
    chunks.splice(0, chunks.length)

    await sendMessage(IM.MessageType.AUDIO)
  }
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
      const contentMatch = textInput.value.match(/^\s*((.|\n)+?)\s*$/i)
      if (matchNotEmpty.test(textInput.value) && contentMatch) {
        content = contentMatch[1]
      }
      break
    case IM.MessageType.AUDIO:
      file = audioFile
      break
    case IM.MessageType.IMAGE:
      file = image.value[0].file
      break
  }

  if (content == null && file == null) return

  let msg: IM.Message = {
    sid: props.sid.toString(),
    uid: commonStore.profile.uid,
    type,
    content,
    timestamp: new Date().getTime(),
    sent: false,
    read: false
  }

  await imStore.sendMessage(msg, file)
  textInput.value = null
  image.value.splice(0, 1)
  audioFile = null
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

function onVoice(recording: boolean) {
  showVoiceRecording.value = recording
  if (recording) {
    if (recorder.state != 'recording') recorder.start()
  }
  else
    recorder.stop()
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