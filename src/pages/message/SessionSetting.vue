<template>
  <van-col style="flex: 1;">
    <van-cell-group title=" ">
      <van-row style="padding: 15px 0 10px 0;">
        <div class="user-item" v-for="user in members">
          <van-image radius="8" fit="cover" width="3.5rem" height="3.5rem"
            :src="`//${commonStore.appConfig?.staticServer + user.avatar}`" />
          <div class="van-ellipsis" style="font-size: 0.7rem; color: grey;">{{ user.name }}</div>
        </div>
        <div class="user-item">
          <div class="btn-add" @click="gotoContact">
            <van-icon class="iconfont icon-add" size="2rem" color="#bdc3c7" style="padding: 8px;" />
          </div>
          <div class="van-ellipsis" style="font-size: 0.7rem; color: #bdc3c7; height: 1rem;"></div>
        </div>
      </van-row>
    </van-cell-group>

    <van-cell-group title=" ">
      <van-cell v-if="session?.type == IM.SessionType.GROUP" :title="$t('message.setting.groupName')" center
        :value="session?.title" is-link @click="showTitleModify = true">
      </van-cell>
      <van-cell :title="$t('message.setting.mute')" center>
        <template #value>
          <van-switch size="24px" v-model="mute" />
        </template>
      </van-cell>
      <van-cell :title="$t('message.setting.pin')" center>
        <template #value>
          <van-switch size="24px" v-model="pin" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group title=" " v-if="session?.type == IM.SessionType.GROUP">
      <van-cell :title="$t('message.setting.notice')" :value="session?.notice" value-class="van-multi-ellipsis--l3"
        is-link center @click="showNoticeModify = true" />
    </van-cell-group>

    <van-cell-group title=" ">
      <van-cell :title="$t('message.setting.cleanHistory')" is-link center @click="showCleanHistory = true" />
      <van-cell :title="$t('message.setting.complain')" is-link center to="/common/complaint"/>
    </van-cell-group>

    <van-button v-if="session?.type == IM.SessionType.GROUP" type="danger" :text="$t('message.setting.quit')"
      style="width: calc(100% - 30px); margin: 15px;" @click="quitSession" />

    <van-popup v-model:show="showTitleModify" style="width: calc(100% - 40px);">
      <van-cell-group :title="$t('message.setting.modifyName')" style="width: 100%;">
        <van-field v-model="session.title" clearable />
      </van-cell-group>
      <van-button type="success" :text="$t('common.save')" style="width: calc(100% - 30px); margin: 15px;"
        @click="saveModify" />
    </van-popup>

    <van-popup v-model:show="showNoticeModify" style="width: calc(100% - 40px);">
      <van-cell-group :title="$t('message.setting.notice')" style="width: 100%;">
        <van-field v-model="session.notice" type="textarea" rows="2" maxlength="50" show-word-limit clearable />
      </van-cell-group>
      <van-button type="success" :text="$t('common.save')" style="width: calc(100% - 30px); margin: 15px;"
        @click="saveModify" />
    </van-popup>

    <van-dialog v-model:show="showCleanHistory" :message="$t('message.setting.cleanTips')" show-cancel-button
      :cancel-button-text="$t('common.cancel')" @cancel="showCleanHistory = false" show-confirm-button
      :confirm-button-text="$t('message.setting.cleanConfirm')" confirm-button-color="#e74c3c"
      @confirm="cleanHistory" />

  </van-col>

</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { IM, IMApi, User } from '../../models';
import { useCommonStore, useIMStore } from '../../store';

const commonStore = useCommonStore()
const imStore = useIMStore()
const i18n = useI18n()
const router = useRouter()

const session = ref<IM.Session>(null)
const members = ref<Array<User.Profile>>([])
const mute = ref(false)
const pin = ref(false)
const showTitleModify = ref(false)
const showNoticeModify = ref(false)
const showCleanHistory = ref(false)

onMounted(async () => {
  let sid = useRoute().params['sid'] as string
  commonStore.navbar.title = i18n.t('message.setting.title')

  session.value = await imStore.session(sid)

  if (session.value.type == IM.SessionType.GROUP) {
    session.value = await IMApi.syncFrom(sid)
    await imStore.updateSession(session.value)
  }

  mute.value = session.value.muted
  pin.value = session.value.pinned > 0

  for (let uid of session.value.members) {
    let profile = await imStore.user(uid)
    members.value.push(profile)
  }
})

watch(mute, async () => {
  session.value.muted = mute.value
  await imStore.updateSession(session.value)
})

watch(pin, async (val, oldVal) => {
  if ((session.value.pinned > 0) == val) { return }
  session.value.pinned = val ? new Date().getTime() : 0
  await imStore.updateSession(session.value)
})

async function saveModify() {
  await imStore.updateSession(session.value)
  showTitleModify.value = false
  showNoticeModify.value = false
}

async function cleanHistory() {
  showCleanHistory.value = false
}

async function quitSession() {
  let idx = session.value.members.indexOf(commonStore.profile.uid)
  session.value.members.splice(idx, 1)
  await imStore.updateSession(session.value)
  await imStore.deleteSession(session.value.sid)

  router.go(-2)
}

function gotoContact() {
  router.push({ name: 'Contact', query: { multi: 1, sid: session.value.sid } })
}

</script>
<style scoped>
.user-item {
  text-align: center;
  width: 3.5rem;
  margin-left: 15px;
}

.btn-add {
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 8px;
  border: dashed 2px #bdc3c7;
  margin-top: 2px;
}

.btn-add:active {
  background: #bdc3c7af;
}
</style>