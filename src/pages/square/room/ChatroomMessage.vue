<template>
  <van-row class="message">
    <van-image round radius="2rem" width="2rem" height="2rem" class="user-avatar" fit="cover"
      :src="'//' + commonStore.appConfig.staticServer + message.userInfo?.avatar"
      v-if="message.type == Chatroom.MsgType.ChatText||message.type == Chatroom.MsgType.ChatEmoji" />
    <div class="message-content">

      <div class="message-frame" :style="{
        borderImageSource: `url('//${commonStore.appConfig?.staticServer + message.userInfo?.msgFrame}')`,
      }" v-if="message.userInfo?.msgFrame"></div>
      <template v-if="message.type == Chatroom.MsgType.ChatText">
        <div class="chat-content" :style="{ background: commonStore.profile.msgFrame ? 'transparent' : '#0807077d' }">
          <span>{{ message.content }}</span>
        </div>
      </template>
      <template v-else-if="(message.type == Chatroom.MsgType.ChatEmoji)">
        <div class="chat-content" :style="{ background: commonStore.profile.msgFrame ? 'transparent' : '#0807077d' }">
          <van-image ref="image" block width="2.5rem" height="2.5rem" fit="cover"
            :src="`//${commonStore.appConfig?.staticServer + message.content}`" />
        </div>
      </template>

      <template v-else-if="(message.type == Chatroom.MsgType.Sys)">
        <div class="sys-info" v-html="message.content"></div>
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
  max-width: 80%;
  position: relative;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  /* flex-grow: 1; */
  align-items: flex-start;
}

.message-frame {
  position: absolute;
  width: calc(100% - 50px);
  height: calc(100% - 50px);
  border: 25px solid transparent;
  border-image-slice: 47% fill;
  border-image-repeat: repeat;
}

.chat-content {
  color: #ecf0f1;
  padding: 15px;
  border-radius: 0 15px 0 15px;
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