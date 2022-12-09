<template>
  <van-index-bar>
    <van-index-anchor index="A" />
    <van-cell :title="profile.name" v-for="profile in contacts" clickable @click="gotoSession(profile)" />
    <van-index-anchor index="B" />
    <van-cell title="文本" />
    <van-cell title="文本" />
    <van-cell title="文本" />
  </van-index-bar>
</template>
<script lang="ts" setup>

import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { CommonApi, IM, User } from '../../models'
import { useCommonStore, useIMStore } from '../../store'
import md5 from 'md5'
import { Notify } from 'vant'

const router = useRouter()
const commonStore = useCommonStore()
const imStore = useIMStore()
const contacts = ref<Array<User.Profile & User.Account>>([])

onMounted(async () => {
  commonStore.navbar.title = useI18n().t('message.contact.title')
  contacts.value = await CommonApi.getContact()
})

async function gotoSession(profile: User.Profile) {
  let sid = md5([commonStore.profile.uid, profile.uid].sort().join(';'))
  let session: IM.Session = {
    sid: sid,
    type: IM.SessionType.P2P,
    members: [profile.uid, commonStore.profile.uid],
    title: profile.name,
    thumb: profile.avatar,
    timestamp: new Date().getTime(),
    unread: 0
  }
  try {
    await imStore.createSession(session)
    router.push({ name: 'Session', params: { sid }, replace: true })
  } catch (err) {
    Notify({ type: 'danger', message: err.toString(), duration: 500 })
  }
}
</script>
<style scoped>

</style>