<template>
  <van-col style="flex: 1; min-width: 375px;">
    <van-list v-model:loading="loading" :finished="finished" style="height: 100%; overflow-y: auto;">
      <van-cell title="系统消息" label="10号机异常" center clickable to="/message/sysMessages">
        <template #icon>
          <van-icon class="iconfont icon-notification" size="26" color="#4fc08d" style="margin: 10px 20px 10px 12px;" />
        </template>
        <template #value>
          <div style="font-size: 0.7rem;">10:23</div>
          <van-badge :content="2" style=" margin: 15px 15px 0 15px;" />
        </template>
      </van-cell>

      <van-swipe-cell v-for="session in sessions">
        <van-cell :title="session.title" title-class="van-ellipsis" :label="session.snapshot"
          label-class="van-multi-ellipsis--l2" value-class="timestamp" center clickable
          @click="gotoSession(session.sid, session.title)">
          <template #icon>
            <van-image :src="session.thumb" radius="5" fit="cover" width="3rem" height="3rem"
              style="margin-right: 15px;" />
          </template>
          <template #value>
            <van-row justify="end">
              <div>
                <van-icon class="iconfont icon-pin" size="15px" v-if="session.pinned > 0"
                  style="margin: 5px 5px 0 0; color: #f39c12; font-weight: bold;" />
                <van-icon class="iconfont icon-mute" size="15px" v-if="session.muted" style="margin: 5px 5px 0 0;" />
              </div>
              <div>
                <div>{{ $d(new Date(session.timestamp), 'short') }}</div>
                <van-badge v-if="!session.muted && session.unread != 0"
                  :content="session.unread > 99 ? '99+' : session.unread" style="margin: 15px 15px 0 15px;" />
                <van-badge v-if="session.muted && session.unread > 0" dot style="margin: 15px 15px 0 15px;" />
              </div>
            </van-row>
          </template>
        </van-cell>
        <template #right>
          <van-button square type="danger" style="width: 60px; height: 100%;" :text="$t('common.delete')"
            @click="imStore.deleteSession(session.sid)" />
          <van-button square type="primary" style="width: 60px; height: 100%;"
            :text="$t(session.pinned > 0 ? 'message.unpin' : 'message.pin')" @click="pin(session)" />
        </template>
      </van-swipe-cell>
      <van-button block text="test" @click="show = !show" />
      <div v-if="show" v-motion :initial="{ opacity: 0, x: 100, }" :enter="{ opacity: 1, x: 50, }"
        :leave="{ x: 0, opacity: 1, }" style="width: 100px; height: 100px; background-color: antiquewhite;"></div>
    </van-list>
  </van-col>
</template>

<script lang="ts" setup>
import { Notify } from 'vant'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { IM } from '../../models'
import { useCommonStore, useIMStore } from '../../store'

const commonStore = useCommonStore()
const imStore = useIMStore()
const i18n = useI18n()
const router = useRouter()

const show = ref(false)
const loading = ref(false)
const finished = ref(false)
const sessions = ref<Array<IM.Session>>([])

onMounted(async () => {
  commonStore.navbar.title = i18n.t('message.title')
  commonStore.navbar.leftArrow = false
  commonStore.navbar.rightText = 'icon-contacts'
  commonStore.rightAction = gotoContact

  imStore.updateSessions++
})

watch(() => imStore.updateSessions, async () => {
  await onLoad()
})

async function onLoad() {
  try {
    loading.value = true
    sessions.value = await imStore.sessions()
  } catch (err) {
    console.error(err)
    Notify({ type: 'danger', message: err.toString(), duration: 500 })
  } finally {
    loading.value = false
    finished.value = true
  }
}

function gotoContact() {
  router.push({ name: 'Contact', query: { multi: 0 } })
}

function gotoSession(sid: string, title: string) {
  router.push({ name: 'Session', params: { sid } })
}

async function pin(session: IM.Session) {
  session.pinned = session.pinned > 0 ? 0 : new Date().getTime()
  await imStore.updateSession(session)
}

</script>
<style >
.timestamp {
  font-size: 0.7rem;
  width: 80px;
  flex: none;
}
</style>