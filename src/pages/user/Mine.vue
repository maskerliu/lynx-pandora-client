<template>
  <van-col>
    <van-cell-group>
      <van-cell ref="userProfile" class="animate__animated" v-bind:class="doShake ? 'animate__headShake' : null"
        v-bind:style="{backgroundColor: doShake? '#d6303188': 'white'}" style="padding-top: 15px;" center is-link
        :to="`profile/uid`">
        <template #icon>
          <van-image :radius="5" width="8rem" height="8rem" fit="cover" :src="commonStore.profile?.avatar" />
        </template>
        <template #value>
          <div style="margin-left: 15px; text-align: left;" v-if="commonStore.profile">
            <h3 :style="{ color: commonStore.profile.name == null ? '#d63031' : '#2d3436' }">
              {{ commonStore.profile.name == null ? $t('mine.needUpdateProfile') : commonStore.profile.name }}
            </h3>
          </div>
          <div style="margin-left: 15px; text-align: left;">
            <van-tag plain type="primary" v-for="role in commonStore.operator?.fullRoles" style="margin-right: 15px;">
              {{ role.name }}
            </van-tag>
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group title="  ">
      <van-cell :title="$t('mine.company')" :title-style="{ 'max-width': '100px' }" center is-link @click="goCompany">
        <template #icon>
          <van-icon class="iconfont icon-company" size="24" color="#34495e" style="margin-right: 10px;" />
        </template>
        <template #value>
          <div class="van-ellipsis" style="max-width: 100%; text-align: right;">
            {{ commonStore.company ? commonStore.company.name : $t('mine.createCompany') }}
          </div>
        </template>
      </van-cell>
      <van-cell :title="$t('mine.bindDevice')" center is-link @click="goBind">
        <template #icon>
          <van-icon class="iconfont icon-zhongjiqi" size="24" color="#27ae60" style="margin-right: 10px;" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group title="  ">
      <van-cell :title="$t('mine.myChatrooms')" is-link to="/square/myRooms">
        <template #icon>
          <van-icon class="iconfont icon-channel" size="24" color="#2980b9" style="margin-right: 10px;" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group title="  ">
      <van-cell :title="$t('mine.settings')" is-link to="/settings">
        <template #icon>
          <van-icon class="iconfont icon-setting" size="24" color="grey" style="margin-right: 10px;" />
        </template>
      </van-cell>
    </van-cell-group>

  </van-col>
</template>
<script lang="ts" setup>
import 'animate.css';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCommonStore } from '../../store';

const commonStore = useCommonStore()
const router = useRouter()

const userProfile = ref()
const doShake = ref(false)

onMounted(() => {
  userProfile.value.$el.addEventListener('animationend', () => { doShake.value = false })

  // await commonStore.updateUserInfo()
})

function goBind() {
  if (commonStore.profile == null) {
    doShake.value = true
  } else {
    router.push('/iot/bind')
  }
}

function goCompany() {
  if (commonStore.profile == null) {
    doShake.value = true
  } else {
    router.push('/iot/company')
  }
}

</script>
<style scoped>

</style>