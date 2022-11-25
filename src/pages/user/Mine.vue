<template>
  <van-col style="width: 100%">
    <van-cell-group>
      <van-cell style="padding-top: 15px;" center is-link :to="`profile/uid`">
        <template #icon>
          <van-image :radius="5" width="8rem" height="8rem" fit="cover" :src="commonStore.profile?.avatar" />
        </template>
        <template #value>
          <div style="margin-left: 15px;">
            <h3>{{ commonStore.profile?.name }}</h3>
          </div>
          <div style="margin-left: 15px;">
            <van-tag plain type="primary">Admin</van-tag>
            <van-tag plain type="danger" style="margin-left: 10px;">Manager</van-tag>
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group title="  ">
      <van-cell :title="$t('mine.company')" center is-link to="/company"
        :value="commonStore.company.name ? commonStore.company.name : $t('mine.createCompany')">
        <template #icon>
          <van-icon class="iconfont icon-company" size="24" color="green" style="margin-right: 10px;" />
        </template>
      </van-cell>
      <van-cell :title="$t('mine.bindDevice')" center is-link to="/iot/bind">
        <template #icon>
          <van-icon class="iconfont icon-zhongjiqi" size="24" color="green" style="margin-right: 10px;" />
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
import { onMounted } from 'vue';
import { useCommonStore } from '../../store';

const commonStore = useCommonStore()

onMounted(async () => {
  commonStore.updateUserInfo()
})

</script>
<style scoped>

</style>