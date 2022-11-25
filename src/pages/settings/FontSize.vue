<template>
  <van-row>

  </van-row>
</template>
<script lang="ts" setup>

import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '../../store';

const i18n = useI18n()
const commonStore = useCommonStore()

onMounted(() => {
  commonStore.navbar.title = i18n.t('settings.fontlang.fontSize')
})

</script>
<style scoped>

</style>