<template>
  <van-cell-group style="width: 100%;" :title="$t('settings.sys.title')">
    <van-cell :title="$t('settings.sys.mqttBroker')" :value="commonStore.appConfig.broker" value-class="van-multi-ellipsis--l2" />
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
</style>