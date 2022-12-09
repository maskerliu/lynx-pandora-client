<template>
  <van-col style="flex: 1;">

    <van-cell-group title=" ">
      <van-row style="padding: 15px 0 10px 0;">
        <div v-for="user in members" style="text-align: center; width: 4rem; margin-left: 15px;">
          <van-image radius="5" fit="cover" :src="user.avatar" width="4rem" height="4rem" style="" />
          <div class="van-ellipsis" style="font-size: 0.7rem; color: grey;">{{ user.name }}</div>
        </div>
      </van-row>

    </van-cell-group>

    <van-cell-group title=" ">
      <van-cell :title="$t('message.setting.mute')" center>
        <template #value>
          <van-switch size="24px"></van-switch>
        </template>
      </van-cell>
      <van-cell :title="$t('message.setting.pin')" center>
        <template #value>
          <van-switch size="24px"></van-switch>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group title=" ">
      <van-cell :title="$t('message.setting.complain')" is-link center />
    </van-cell-group>
  </van-col>

</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { User } from '../../models'
import { useCommonStore, useIMStore } from '../../store'

const commonStore = useCommonStore()
const imStore = useIMStore()
const i18n = useI18n()
const members = ref<Array<User.Profile>>([])


onMounted(async () => {
  let sid = useRoute().params['sid'] as string
  commonStore.navbar.title = i18n.t('message.setting.title')
  let session = await imStore.session(sid)
  for (let uid of session.members) {
    let profile = await imStore.user(uid)
    members.value.push(profile)
  }
})

</script>
<style scoped>

</style>