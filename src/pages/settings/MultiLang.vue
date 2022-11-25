<template>
  <van-radio-group v-model="checked">
    <van-cell-group>
      <van-cell :title="local" v-for="local in i18n.availableLocales" clickable @click="checked = local">
        <template #right-icon>
          <van-radio :name="local" />
        </template>
      </van-cell>
    </van-cell-group>
  </van-radio-group>
</template>
<script lang="ts" setup>

import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '../../store';

const i18n = useI18n()
const checked = ref(null)
const commonStore = useCommonStore()

onMounted(() => {
  commonStore.navbar.title = i18n.t('settings.fontlang.multiLang')
  checked.value = commonStore.locale
})

watch(checked, () => {
  i18n.locale.value = checked.value
  commonStore.locale = checked.value
})



</script>
<style scoped>

</style>