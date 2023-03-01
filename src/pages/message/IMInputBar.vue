<template>
  <van-col ref="inputBar" class="input-bar">
    <van-field v-model="textInput" type="textarea" autosize rows="1" center clearable>
      <template #left-icon>
        <van-button round @touchstart.prevent="onVoice(true)" @touchend.prevent="onVoice(false)"
          @mousedown.prevent="onVoice(true)" @mouseup.prevent="onVoice(false)"
          style="width: 35px; height: 35px; margin-right: 15px;">
          <template #icon>
            <van-icon class="iconfont icon-voice" size="24" />
          </template>
          <audio ref="audioRecord"></audio>
        </van-button>
      </template>
      <template #right-icon>
        <van-uploader v-model="image" closeImagePreview :preview-image="false" v-if="textInput?.length == 0"
          :after-read="() => sendMessage(IM.MessageType.IMAGE)" @click-upload="openFileSelector">
          <van-button type="success" plain style="width: 45px; height: 30px;  margin-left: 15px; position: relative;">
            <template #icon>
              <van-icon class="iconfont icon-file" size="20" />
            </template>
          </van-button>
        </van-uploader>

        <van-button v-else type="success" plain @click="sendMessage(IM.MessageType.TEXT)"
          style="width: 45px; height: 32px;  margin-left: 15px; ">
          <template #icon>
            <van-icon class="iconfont icon-send" size="18" />
          </template>
        </van-button>

        <IMEmojiPanel :sid="sid" v-model:show="showEmojiPanel" v-model:text-emoji="txtEmoji" />

        <van-button round @click="gotoCreateRedPacket"
          style="width: 35px; height: 35px; margin-left: 15px; color: #e67e22">
          <template #icon>
            <van-icon class="iconfont icon-red-packet" size="18" />
          </template>
        </van-button>

        <van-popup v-model:show="showVoiceRecording">
          <van-icon class="iconfont icon-voice" size="24" style="padding: 50px;" />
          <audio controls :src="audioRecord" />
        </van-popup>
      </template>
    </van-field>

    <van-row v-if="imStore.quoteMessage">
      <van-notice-bar class="quote-msg" :text="quoteSnap" :scrollable="false" mode="closeable" @close="removeQuote" />
    </van-row>
  </van-col>
</template>
<script lang ="ts" setup>
import { UploaderFileListItem } from 'vant'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { IM } from '../../models'
import router from '../../router'
import { useCommonStore, useIMStore } from '../../store'
import IMEmojiPanel from './IMEmojiPanel.vue'

const props = defineProps<{
  sid: string
}>()

const commonStore = useCommonStore()
const imStore = useIMStore()

const inputBar = ref()
const showVoiceRecording = ref(false)
const showEmojiPanel = ref(false)
const textInput = ref(null)
const txtEmoji = ref(null)
const image = ref<Array<UploaderFileListItem>>([])
const audioRecord = ref<string>('')
const quoteSnap = ref<string>('')

let session: IM.Session = null
let recorder: MediaRecorder
let audioFile: File = null
let hasQuoteMsg = false

const matchNotEmpty = /[^\s]+/i

onMounted(async () => {
  if (window.argus) {
    window.webApp.register(onFileSelect)
  }

  session = await imStore.session(props.sid.toString())

  // await initRecorder()
})

onBeforeUnmount(() => {
  if (window.argus) {
    window.webApp.unRegister(onFileSelect.name)
  }
})

watch(() => imStore.quoteMessage, async () => {
  if (imStore.quoteMessage != null) {
    let user = await imStore.user(imStore.quoteMessage.uid)
    switch (imStore.quoteMessage?.type) {
      case IM.MessageType.AUDIO:
        quoteSnap.value = `${user.name}: [音频]`
        break
      case IM.MessageType.EMOJI:
        quoteSnap.value = `${user.name}: [表情]`
        break
      case IM.MessageType.IMAGE:
        quoteSnap.value = `${user.name}: [图片]`
        break
      case IM.MessageType.TEXT:
        quoteSnap.value = `${user.name}: ${imStore.quoteMessage.content}`
        break
    }
  }

  hasQuoteMsg = imStore.quoteMessage != null
  let height = hasQuoteMsg ? 110 : 60
  inputBar.value.$el.style.top = `calc(100% - ${height}px)`
  inputBar.value.$el.style.transition = `all 0.2s ease-out`
})

watch(showEmojiPanel, () => {
  let height = 0
  if (showEmojiPanel.value) {
    height = hasQuoteMsg ? 409 : 359
  } else {
    height = hasQuoteMsg ? 110 : 60
  }
  inputBar.value.$el.style.top = `calc(100% - ${height}px)`
  inputBar.value.$el.style.transition = `all 0.35s ease-out`
})

watch(txtEmoji, () => {
  if (txtEmoji.value) {
    textInput.value += txtEmoji.value
    txtEmoji.value = null
  }
})

function removeQuote() {
  imStore.quoteMessage = null
}

function openFileSelector() {
  if (window.argus) {
    window.argus.fileSelect(0, 1)
    return
  }
}

async function initRecorder() {
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
    case IM.MessageType.AUDIO:
      file = audioFile
      break
    case IM.MessageType.IMAGE:
      file = image.value[0].file
      break
  }

  if (content == null && file == null) return

  let uid = commonStore.profile.uid
  let to = session.type == IM.SessionType.P2P ? session.members.filter(it => it != uid)[0] : null
  let msg: IM.Message = {
    sid: props.sid.toString(),
    uid: commonStore.profile.uid,
    type, content, to,
    timestamp: new Date().getTime(),
    sent: 0,
    read: false,
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

function gotoCreateRedPacket() {
  router.push({ name: 'CreateRedPacket', params: { sid: props.sid } })
}


</script>
<style scoped>
.input-bar {
  position: absolute;
  top: calc(100% - 60px);
  background: white;
  /* background: transparent; */
  /* transition: all 0.1s linear; */
}

.quote-msg {
  background: #ecf0f1;
  border-radius: 8px;
  width: calc(100% - 30px);
  margin: 5px 15px;
  padding: 0 10px;
}
</style>