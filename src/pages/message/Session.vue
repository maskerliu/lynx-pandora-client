<template>
  <van-col style="flex: 1; min-width: 375px;">
    <van-notice-bar v-if="session?.type == IM.SessionType.GROUP && session.notice" left-icon="volume-o"
      :text="session.notice" />

    <van-list ref="msgContainer" style="height: calc(100% - 60px); padding-bottom: 20px; overflow-y: auto">
      <van-pull-refresh v-model="loading" @refresh="onLoadingMore">
        <message :message="message" v-for="message in messages" :key="message._id" />
      </van-pull-refresh>
    </van-list>
    <msg-input-bar :sid="(route.params['sid'] as string)" />
  </van-col>
</template>

<script lang="ts" setup>
import { Notify } from 'vant'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IM } from '../../models'
import { useCommonStore, useIMStore } from '../../store'
import MsgInputBar from './MsgInputBar.vue'
import Message from './Message.vue'

const router = useRouter()
const route = useRoute()
const commonStore = useCommonStore()
const imStore = useIMStore()

const msgContainer = ref()
const loading = ref<boolean>(false)
const session = ref<IM.Session>(null)
const messages = ref<Array<IM.Message>>([])

onMounted(async () => {
  commonStore.navbar.rightText = 'icon-more'
  commonStore.rightAction = gotoSessionSetting
  imStore.sid = route.params['sid'] as string
  imStore._messages = []
  loading.value = true

  session.value = await imStore.session(route.params['sid'] as string)
  session.value.unread = 0
  commonStore.navbar.title = session.value.title
  await imStore.updateSession(session.value)

  imStore.updateMessages++
})

onUnmounted(() => {
  imStore.sid = null
  imStore.cleanMessages()
})

watch(() => imStore.updateMessages, async () => {
  messages.value = await imStore.messages()
  loading.value = false
  setTimeout(async () => {
    scrollToBottom(true)
  }, 200)
})

function scrollToBottom(smooth: boolean) {
  msgContainer.value.$el.scrollTo({ top: msgContainer.value.$el.scrollHeight, behavior: smooth ? 'smooth' : null })
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