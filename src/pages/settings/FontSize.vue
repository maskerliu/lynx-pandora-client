<template>
  <van-col>

    <van-slider step="10" v-model="fontSize" style="position: absolute; bottom: 50;">
      <template #button>
        <div class="custom-button">{{ fontSize }}</div>
      </template>
    </van-slider>
  </van-col>
</template>
<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '../../store';

const i18n = useI18n()
const commonStore = useCommonStore()
const fontSize = ref(20)

onMounted(() => {
  commonStore.navbar.title = i18n.t('settings.fontlang.fontSize')
})

</script>
<style scoped>

</style>