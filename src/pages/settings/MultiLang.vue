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
import { inject, onMounted, ref, watch } from 'vue';
import { CommonStore, I18n } from '../components/misc';

const commonStore = inject(CommonStore)
const i18n = inject(I18n)
const checked = ref(null)

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