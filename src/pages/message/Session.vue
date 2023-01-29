<template>
  <van-col style="flex: 1; min-width: 375px;">
    <van-notice-bar v-if="session?.type == IM.SessionType.GROUP && session.notice" left-icon="volume-o"
      :text="session.notice" />

    <van-list ref="msgContainer" style="height: calc(100% - 60px); padding-bottom: 20px; overflow-y: auto">
      <van-pull-refresh v-model="loading" @refresh="onLoadingMore">
        <message :message="message" v-for="message in messages" :key="message._id" @click="onMessageClicked(message)" />
      </van-pull-refresh>
    </van-list>

    <RedPacket v-model:show="showRedPacket" :order="redpacketOrder" />

    <IMInputBar :sid="(route.params['sid'] as string)" />
  </van-col>
</template>

<script lang="ts" setup>
import { showNotify } from 'vant'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IM } from '../../models'
import { useCommonStore, useIMStore } from '../../store'
import IMInputBar from './IMInputBar.vue'
import Message from './Message.vue'
import RedPacket from './RedPacket.vue'

const router = useRouter()
const route = useRoute()
const commonStore = useCommonStore()
const imStore = useIMStore()

const msgContainer = ref()
const loading = ref<boolean>(false)
const session = ref<IM.Session>(null)
const messages = ref<Array<IM.Message>>([])
const showRedPacket = ref(false)
const redpacketOrder = ref<IM.RedPacketOrder>(null)

let sid: string = null

onMounted(async () => {
  commonStore.navbar.rightText = 'icon-more'
  commonStore.rightAction = gotoSessionSetting
  sid = route.params['sid'] as string
  imStore._messages = []
  loading.value = true

  session.value = await imStore.session(sid)
  session.value.unread = 0
  commonStore.navbar.title = session.value.title
  await imStore.updateSession(session.value)

  imStore.updateMessages++
})

onUnmounted(() => {
  imStore.cleanMessages()
})

watch(() => imStore.updateMessages, async () => {
  messages.value = await imStore.messages(sid)
  loading.value = false
  setTimeout(async () => {
    scrollToBottom(true)
  }, 200)
})

function scrollToBottom(smooth: boolean) {
  msgContainer.value?.$el.scrollTo({ top: msgContainer.value.$el.scrollHeight, behavior: smooth ? 'smooth' : null })
  // msgContainer.value.$el.scrollTo({ top: msgContainer.value.$el.scrollHeight })
}

function gotoSessionSetting() {
  router.push({ name: 'SessionSetting', params: { sid } })
}

async function onLoadingMore() {
  try {
    loading.value = true
    messages.value = await imStore.messages(sid, true)
  } catch (err) {
    showNotify({ type: 'danger', message: err.toString(), duration: 800 })
  } finally {
    loading.value = false
  }
}

async function onMessageClicked(message: IM.Message) {
  switch (message.type) {
    case IM.MessageType.RedPacket:
      showRedPacket.value = true
      redpacketOrder.value = message.content as IM.RedPacketOrder
      break
  }
}

</script>
<style scoped>

</style>