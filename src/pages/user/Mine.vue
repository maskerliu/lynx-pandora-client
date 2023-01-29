<template>
  <van-col style="height: 100%; overflow-y: auto;">
    <van-cell-group>
      <van-cell ref="userProfile" class="animate__animated" v-bind:class="doShake ? 'animate__headShake' : ''"
        v-bind:style="{backgroundColor: doShake? '#d6303188': 'white'}" style="padding-top: 15px;" center is-link
        :to="`profile/uid`">
        <template #icon>
          <van-image :radius="12" width="6rem" height="6rem" fit="cover"
            :src="commonStore.profile ? `//${commonStore.appConfig?.staticServer + commonStore.profile?.avatar}` : ''" />
        </template>
        <template #value>
          <div style="margin-left: 15px; text-align: left; font-size: 1.2rem;" v-if="commonStore.profile">
            <span :style="{ color: commonStore.profile.name == null ? '#d63031' : '#2d3436' }">
              {{ commonStore.profile.name == null ? $t('mine.needUpdateProfile') : commonStore.profile.name }}
            </span>

            <van-image width="2.4rem" style="margin: 0 10px;" fit="cover"
              :src="`//${commonStore.appConfig?.staticServer + '/_res/f400c3653e96455f857587b89bd3e0ab.png'}`" />

            <van-icon class="iconfont"
              :class="commonStore.profile.vipType == User.VIPType.Normal ? 'icon-vip' : 'icon-svip'" size="1.2rem"
              style="font-weight: bold;"
              :style="{ color: commonStore.profile.vipType == User.VIPType.Normal ? '#bdc3c7' : '#c0910e' }"
              v-if="commonStore.profile.vipType > -1" />
          </div>
          <div style="margin: 15px; text-align: left;">
            <van-tag plain type="primary" v-for="role in commonStore.operator?.fullRoles" style="margin-right: 15px;">
              {{ role.name }}
            </van-tag>
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group title="  " v-for="group in settings">
      <van-cell :title="$t(setting.title)" :title-style="{ 'max-width': '100px' }" center is-link
        @click="setting.onClick" :to="setting.to" v-for="setting in group">
        <template #icon>
          <van-icon class="iconfont" v-bind:class="setting.icon" size="24" :color="setting.color"
            style="margin-right: 10px;" />
        </template>
        <template #value>
          <div class="van-ellipsis" style="max-width: 100%; text-align: right;">
            {{ setting.value }}
          </div>
        </template>
      </van-cell>
    </van-cell-group>
  </van-col>
</template>
<script lang="ts" setup>
import 'animate.css';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { User } from '../../models';
import { useCommonStore } from '../../store';

const i18n = useI18n()
const router = useRouter()
const commonStore = useCommonStore()

const userProfile = ref()
const doShake = ref(false)

type SettingItem = {
  title: string,
  icon: string,
  color: string,
  to?: string
  onClick?: Function
  value?: string
}

const settings = ref<Array<Array<SettingItem>>>([])

onMounted(() => {
  userProfile.value.$el.addEventListener('animationend', () => { doShake.value = false })

  let group = [
    { title: 'mine.organization', icon: 'icon-organization', color: '#d35400', onClick: goComapny, value: commonStore.company ? commonStore.company.name : i18n.t('mine.createCompany') },
    { title: 'mine.bindDevice', icon: 'icon-zhongjiqi', color: '#3867d6', onClick: goBind },
  ] as Array<SettingItem>
  settings.value.push(group)

  group = [
    { title: 'mine.myChatrooms', icon: 'icon-channel', color: '#9b59b6', to: '/square/myRooms' },
    { title: 'mine.myMoments', icon: 'icon-moment', color: '#009432', to: `/square/moments/${commonStore.profile?.uid}` },
    { title: 'mine.myPosts', icon: 'icon-post', color: '#2c3e50', to: '/square/myPosts' },
  ] as Array<SettingItem>
  settings.value.push(group)


  group = [
    { title: 'mine.myWallet', icon: 'icon-wallet', color: '#3498db', to: '/payment/myWallet' },
    { title: 'mine.propStore', icon: 'icon-prop-store', color: '#FC427B', to: '/square/propStore' },
    { title: 'mine.vip', icon: 'icon-membership', color: '#f39c12', to: '/mine/vip' },
    { title: 'mine.grade', icon: 'icon-grade', color: '#8e44ad', to: '/mine/grade' },
  ] as Array<SettingItem>
  settings.value.push(group)

  group = [
    { title: 'mine.settings', icon: 'icon-setting', color: 'grey', to: '/settings' },
  ] as Array<SettingItem>
  settings.value.push(group)
})

watch(() => commonStore.company, () => {
  settings.value[0][0].value = commonStore.company ? commonStore.company.name : i18n.t('mine.createCompany')
})

function goBind() {
  if (commonStore.profile == null) {
    doShake.value = true
  } else {
    router.push('/iot/bind')
  }
}

function goComapny() {
  if (commonStore.profile == null) {
    doShake.value = true
  } else {
    router.push('/organization/company')
  }
}

</script>
<style scoped>

</style>