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
import { inject, onMounted, ref } from 'vue';
import { CommonStore, I18n } from '../components/misc';

const commonStore = inject(CommonStore)
const i18n = inject(I18n)
const fontSize = ref(20)

onMounted(() => {
  commonStore.navbar.title = i18n.t('settings.fontlang.fontSize')
})

</script>
<style scoped>

</style>