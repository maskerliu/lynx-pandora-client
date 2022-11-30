<template>
  <van-list style="height: 100%; overflow-y: auto; overflow-x: hidden;">
    <van-cell title="系统消息" label="10号机异常" center clickable>
      <template #icon>
        <van-icon class="iconfont icon-notification" size="26" color="#4fc08d" style="margin-right: 15px;" />
      </template>
      <template #value>
        <div style="font-size: 0.7rem;">10:23</div>
        <van-badge :content="2" style=" margin: 15px 15px 0 15px;" />
      </template>
    </van-cell>

    <van-cell v-for="i in 10" title="张三" label="下午6点过来换班哦" value="10:23" value-class="timestamp" center clickable>
      <template #icon>
        <van-icon class="iconfont icon-mine" size="26" color="" style="margin-right: 15px;" />
      </template>
      <template #value>
        <div style="font-size: 0.7rem;">10:23</div>
        <van-badge :content="2" style=" margin: 15px 15px 0 15px;" />
      </template>
    </van-cell>
  </van-list>
</template>

<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '../../store';
import dingdong from '../../../static/dingdong.m4a'

const i18n = useI18n()
const commonStore = useCommonStore()
const loading = ref(false)
const refreshing = ref(false)
const notifyAudio = new Audio()

onMounted(() => {
  commonStore.navbar.title = i18n.t('message.title')
  commonStore.navbar.leftArrow = false

  notifyAudio.src = dingdong
  notifyAudio.play()

})

async function onRefresh() {
  loading.value = true
  refreshing.value = true

  loading.value = false
  refreshing.value = false
}
</script>
<style scoped>
.timestamp {
  font-size: 0.6rem;
}
</style>