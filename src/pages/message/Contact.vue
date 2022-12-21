<template>
  <van-index-bar>
    <van-list v-model:loading="loading" :finished="finished" @load="loadMore" style="overflow-y: auto;"
      v-bind:style="{ height: isMulti ? 'calc(100% - 74px)' : '100%' }">
      <van-cell :title="profile.name" v-for="(profile, idx) in contacts" clickable @click="gotoSession(profile, idx)">
        <template #icon>
          <van-checkbox v-if="isMulti" :disabled="disabled[idx]" style="margin-right: 15px;" v-model="selected[idx]" />
        </template>
      </van-cell>
    </van-list>
    <div v-if="isMulti" style="width: 100%; position: absolute; bottom: 0; background-color: #eee;">
      <van-button type="success"
        :text="$t(curSession?.type == IM.SessionType.GROUP ? 'message.contact.add' : 'message.contact.create')"
        :loading="isGen" style="width: calc(100% - 30px); margin: 15px;" @click="createMultiChat" />
    </div>
  </van-index-bar>
</template>
<script lang="ts" setup>
import md5 from 'md5'
import { Notify } from 'vant'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { loadImage } from '../../common'
import { CommonApi, IM, User } from '../../models'
import { useCommonStore, useIMStore } from '../../store'

const i18n = useI18n()
const router = useRouter()
const commonStore = useCommonStore()
const imStore = useIMStore()

const loading = ref(false)
const finished = ref(false)
const contacts = ref<Array<User.Profile & User.Account>>([])
const selected = ref<Array<boolean>>([])
const curSession = ref<IM.Session>()
const isGen = ref(false)
const isMulti = ref(false)

let curPage = 0
let disabled = []

onMounted(async () => {
  commonStore.navbar.title = i18n.t('message.contact.title')

  isMulti.value = Number.parseInt(useRoute().query['multi'] as string) == 1
  let sid = useRoute().query['sid'] as string
  if (sid != null) {
    curSession.value = await imStore.session(sid)
    isMulti.value = true
  }

  commonStore.navbar.rightText = isMulti.value ? 'icon-cancel' : 'icon-group-chat'
  commonStore.rightAction = () => {
    isMulti.value = !isMulti.value
    commonStore.navbar.rightText = isMulti.value ? 'icon-cancel' : 'icon-group-chat'
  }
})

async function loadMore() {
  let more = await CommonApi.getContact(++curPage)
  contacts.value = contacts.value.concat(more)

  imStore.cacheUsers(contacts.value)

  selected.value = new Array(contacts.value.length)
  disabled = new Array(contacts.value.length)

  for (let i = 0; i < contacts.value.length; ++i) {
    if (curSession.value) {
      selected.value[i] = curSession.value.members.indexOf(contacts.value[i].uid) != -1
      disabled[i] = selected.value[i]
    }

    if (contacts.value[i].uid == commonStore.profile.uid) {
      selected.value[i] = true
      disabled[i] = true
    }
  }

  if (more.length == 0) finished.value = true
  loading.value = false
}

async function gotoSession(profile: User.Profile, idx: number) {
  if (profile.uid == commonStore.profile.uid) {

  } else if (isMulti.value) {
    if (!disabled[idx])
      selected.value[idx] = !selected.value[idx]
  } else {
    await createSession([profile.uid, commonStore.profile.uid], profile.name, profile.avatar, IM.SessionType.P2P)
  }
}

async function createMultiChat() {

  if (selected.value.filter((it) => { return it }).length < 3) {
    Notify({ type: 'warning', message: '除自己之外，请至少选择两位联系人才可创建群聊', duration: 1200 })
    return
  }

  isGen.value = true

  let uids = []
  let names = []
  let avatars = []
  for (let i = 0; i < selected.value.length; ++i) {
    if (selected.value[i]) {
      uids.push(contacts.value[i].uid)
      names.push(contacts.value[i].name)
      avatars.push(contacts.value[i].avatar)
    }
  }

  let thumb = await genThumb(avatars)
  await createSession(uids, `${names.join('、')}的群聊`, null, IM.SessionType.GROUP, thumb)
  isGen.value = false
}

async function createSession(members: string[], title: string, thumb: string, type: IM.SessionType, snap?: File) {
  let sid = md5(members.sort().join(';'))
  let session: IM.Session = {
    sid, type, members, title, thumb,
    timestamp: new Date().getTime(),
    unread: 0,
    pinned: 0,
  }
  try {
    await imStore.updateSession(session, snap)
    router.push({ name: 'Session', params: { sid }, replace: true })
  } catch (err) {
    Notify({ type: 'danger', message: err.toString(), duration: 1500 })
  }
}

async function genThumb(avatars: Array<string>) {
  let canvas = document.createElement('canvas')
  canvas.width = 320
  canvas.height = 320
  let context = canvas.getContext('2d')
  context.rect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#eee'
  context.fill()

  let size = 100, margin = 5, cols = 3
  if (avatars.length <= 4) {
    size = 135, margin = 17, cols = 2
  }

  for (let i = 1; i <= avatars.length; ++i) {
    if (i >= 10) break
    let img = await loadImage(avatars[i - 1])

    let marginLeft = margin
    if (avatars.length == 3 && i == 3) marginLeft = 90

    context.drawImage(img,
      (i - 1) % cols * (size + margin) + marginLeft,
      Math.floor((i - 1) / cols) * (size + margin) + margin,
      size, size)
  }

  let resp = await fetch(canvas.toDataURL('img/png'))
  let blob = await resp.blob()
  return new File([blob], 'test.png', { type: blob.type })
}

</script>
<style scoped>
.box {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  background-color: var(--splash);
}
</style>