<template>
  <van-col style="flex: 1; min-width: 375px; height: 100%;">
    <van-pull-refresh v-model="loading" style="height: 100%;" @refresh="onLoadingMore">
      <van-list ref="msgContainer" style="height: calc(100% - 70px); overflow-y: auto">
        <message :message="message" v-for="message in messages" />
      </van-list>
    </van-pull-refresh>
    <chat-input-bar :sid="imStore.sid" />
  </van-col>
</template>

<script lang="ts" setup>
import { Notify } from 'vant'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IM } from '../../models'
import { useCommonStore, useIMStore } from '../../store'
import ChatInputBar from './ChatInputBar.vue'
import Message from './Message.vue'

const router = useRouter()
const commonStore = useCommonStore()
const imStore = useIMStore()
const msgContainer = ref()
const loading = ref<boolean>(false)
const messages = ref<Array<IM.Message>>([])

onMounted(async () => {
  let sid = useRoute().params['sid'] as string
  commonStore.navbar.rightText = 'icon-more'
  commonStore.rightAction = gotoSessionSetting
  imStore.sid = sid
  let session = await imStore.session(sid)

  session.timestamp = new Date().getTime()
  session.unread = 0
  await imStore.updateSession(session)

  commonStore.navbar.title = session.title
  messages.value = await imStore.messages(true)

  nextTick(async () => {
    scrollToBottom()
  })
})

onUnmounted(() => {
  imStore.sid = null
})

watch(() => imStore.updateMessage, async () => {
  try {
    messages.value = await imStore.messages()
    nextTick(async () => {
      scrollToBottom()
    })
  } catch (err) {
    console.error(err)
  }
})

function scrollToBottom() {
  // msgContainer.value.$el.scrollTo({ top: msgContainer.value.$el.scrollHeight, behavior: 'smooth' })
  msgContainer.value.$el.scrollTo({ top: msgContainer.value.$el.scrollHeight })
}

function gotoSessionSetting() {
  router.push({ name: 'SessionSetting', params: { sid: imStore.sid } })
}

async function onLoadingMore() {
  try {
    loading.value = true
    messages.value = await imStore.messages(false, true)
  } catch (err) {
    Notify({ type: 'danger', message: err.toString(), duration: 800 })
  } finally {
    loading.value = false
  }


}

</script>
<style scoped>

</style>