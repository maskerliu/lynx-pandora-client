<template>
  <van-col style="flex: 1; min-width: 375px; height: 100%;">
    <van-notice-bar v-if="session?.type == IM.SessionType.GROUP && session.notice" left-icon="volume-o"
      :text="session.notice" />
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
import { inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { IM } from '../../models'
import { CommonStore, IMStore, VueRouter } from '../components/misc'
import ChatInputBar from './ChatInputBar.vue'
import Message from './Message.vue'

const router = inject(VueRouter)
const commonStore = inject(CommonStore)
const imStore = inject(IMStore)

const msgContainer = ref()
const loading = ref<boolean>(false)
const session = ref<IM.Session>(null)
const messages = ref<Array<IM.Message>>([])

onMounted(() => {
  let sid = useRoute().params['sid'] as string
  commonStore.navbar.rightText = 'icon-more'
  commonStore.rightAction = gotoSessionSetting
  imStore.sid = sid
  imStore._messages = []
  loading.value = true

  setTimeout(async () => {
    session.value = await imStore.session(sid)
    session.value.unread = 0
    commonStore.navbar.title = session.value.title
    await imStore.updateSession(session.value)

    imStore.updateMessage++
  }, 300)
})

onUnmounted(() => {
  imStore.sid = null
})

watch(() => imStore.updateMessage, async () => {
  try {
    messages.value = await imStore.messages()
    loading.value = false
    nextTick(async () => {
      scrollToBottom()
    })
  } catch (err) {
    console.error(err)
  }
})

function scrollToBottom() {
  msgContainer.value.$el.scrollTo({ top: msgContainer.value.$el.scrollHeight, behavior: 'smooth' })
  // msgContainer.value.$el.scrollTo({ top: msgContainer.value.$el.scrollHeight })
}

function gotoSessionSetting() {
  router.push({ name: 'SessionSetting', params: { sid: imStore.sid } })
}

async function onLoadingMore() {
  try {
    loading.value = true
    messages.value = await imStore.messages(true)
  } catch (err) {
    Notify({ type: 'danger', message: err.toString(), duration: 800 })
  } finally {
    loading.value = false
  }
}

</script>
<style scoped>

</style>