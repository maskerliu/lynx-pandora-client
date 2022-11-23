<template>
  <van-col style="width: 100%">
    <van-cell-group>
      <van-cell value="test" style="padding-top: 15px;" center is-link :to="`profile/uid`">
        <template #icon>
          <van-image width="8rem" height="8rem" fit="cover"
            src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" />
        </template>
        <template #value>
          <div style="margin-left: 15px;">
            <h3>张三</h3>
          </div>
          <div style="margin-left: 15px;">
            <van-tag plain type="primary">Admin</van-tag>
            <van-tag plain type="danger" style="margin-left: 10px;">Manager</van-tag>
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group title="  ">
      <van-cell :title="$t('mine.company')" value="立峰集团" center is-link size="large" :to="`/company/company._id`">
        <template #icon>
          <van-icon class="iconfont icon-company" size="24" color="green" style="margin-right: 10px;" />
        </template>
      </van-cell>
      <van-cell :title="$t('mine.bindDevice')" center is-link size="large" :to="`/iot/bind/company._id`">
        <template #icon>
          <van-icon class="iconfont icon-zhongjiqi" size="24" color="green" style="margin-right: 10px;" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group title="  ">
      <van-cell :title="$t('mine.settings')" is-link to="/settings" size="large">
        <template #icon>
          <van-icon class="iconfont icon-setting" size="24" color="grey" style="margin-right: 10px;" />
        </template>
      </van-cell>
    </van-cell-group>
  </van-col>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const d = ref()

</script>
<style scoped>

</style>