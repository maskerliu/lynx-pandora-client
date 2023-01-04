<template>
  <van-row class="message">
    <van-image round radius="2rem" width="2rem" height="2rem" class="user-avatar" fit="cover"
      :src="'//' + commonStore.appConfig.staticServer + (message.data as Chatroom.ChatContent).avatar"
      v-if="message.type == Chatroom.MsgType.ChatText||message.type == Chatroom.MsgType.ChatEmoji" />
    <div class="message-content">

      <template v-if="message.type == Chatroom.MsgType.ChatText">
        <div class="chat-content">
          <span ref="msg-content">{{ (message.data as Chatroom.ChatContent).content }}</span>
        </div>
      </template>
      <template v-else-if="(message.type == Chatroom.MsgType.ChatEmoji)">
        <div class="chat-content">
          <van-image ref="image" block width="4rem" height="4rem" fit="cover"
            :src="(message.data as Chatroom.ChatContent).content" />
        </div>
      </template>

      <template v-else-if="(message.type == Chatroom.MsgType.Sys)">
        <div class="sys-info" v-html="(message.data as Chatroom.SysInfoContent).content"></div>
      </template>
    </div>
  </van-row>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getScaleSize } from '../../../common/image.util'
import { Chatroom } from '../../../models'
import { useCommonStore, useIMStore } from '../../../store'

const props = defineProps<{
  message: Chatroom.Message,
  asyncMode?: Boolean,
}>()

const commonStore = useCommonStore()
const imStore = useIMStore()
const avatar = ref()
const audioRef = ref<HTMLAudioElement>()

const width = ref(100)
const height = ref(100)

const clientWidth = document.body.clientWidth * 0.4
const clientHeight = document.body.clientHeight * 0.25

onMounted(async () => {
  // let user = await imStore.user(props.message.uid)
  // avatar.value = user?.avatar
})

function calcImageSize(e: any) {
  if (e.type == 'load') {
    let img = (e.target != null ? e.target : e.path[0]) as HTMLImageElement
    [width.value, height.value] = getScaleSize(img.naturalWidth, img.naturalHeight, clientWidth, clientHeight)
  }
}

</script>

<style lang="css" scoped>
.message {
  position: relative;
  padding: 5px;
}

.user-avatar {
  margin: 0 10px 0 0;
}

.message-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  flex-grow: 1;
  align-items: flex-start;
}

.message-timestamp {
  padding: 2px;
  margin: 0;
  overflow-wrap: break-word;
  font-size: 10px;
  color: #bdb8b8;
  width: 100px;
  display: flex;
  flex-flow: row;
  flex-direction: row-reverse;
}

.chat-content {
  color: #ecf0f1;
  background: #0807077d;
  padding: 10px;
  border-radius: 0 15px 0 15px;
  margin: 5px 0;
  max-width: 70%;
  font-size: 0.8rem;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  word-break: break-word;
}

.sys-info {
  color: #2c3e50;
  background: #aaaaaa7d;
  padding: 5px;
  border-radius: 10px 0 10px 0;
  font-size: 0.8rem;
}
</style>