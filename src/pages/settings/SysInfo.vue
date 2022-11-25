<template>
  <van-cell-group style="width: 100%;" :title="$t('settings.sys.title')">
    <van-cell :title="$t('settings.sys.mqttBroker')" :value="commonStore.appConfig.broker" />
    <van-cell :title="$t('settings.sys.about')" is-link to="about" />
    <van-cell :title="$t('settings.sys.help')" is-link to="about" />
  </van-cell-group>
</template>
<script lang="ts" setup>
import { onMounted, watch } from 'vue';
import { useCommonStore } from '../../store';

const commonStore = useCommonStore()

onMounted(() => {

})

watch(() => commonStore.appConfig, () => {

})


</script>
<style scoped>
.single-line {
  max-width: 80px;
  font-size: 0.7rem;
  color: #34495e;
  padding: 5px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>