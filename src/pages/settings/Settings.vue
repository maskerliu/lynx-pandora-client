<template>
  <van-col style="overflow-y: auto">
    <van-cell-group :title="$t('settings.sys.title')">
      <van-cell :title="$t('settings.sys.mqttBroker')" :value="commonStore.appConfig?.broker" />
      <van-cell :title="$t('settings.sys.about')" center is-link to="about" />
      <van-cell :title="$t('settings.sys.help')" center is-link to="help" />
      <van-cell :title="$t('settings.sys.cleanCache')" center clickable :value="cacheSize"
        @click="showCleanCahe = true" />
    </van-cell-group>

    <van-cell-group :title="$t('settings.notify.title')">
      <van-cell :title="$t('settings.notify.sound')" center>
        <template #value>
          <van-switch size="20px" v-model="commonStore.sharePrefs.sound" />
        </template>
      </van-cell>
      <van-cell :title="$t('settings.notify.vibrate')">
        <template #value>
          <van-switch size="20px" v-model="commonStore.sharePrefs.vibrate" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group :title="$t('settings.fontlang.title')">
      <van-cell :title="$t('settings.fontlang.fontSize')" center is-link to="fontSize" />
      <van-cell :title="$t('settings.fontlang.multiLang')" center is-link to="multiLang" />
    </van-cell-group>

    <van-button type="danger" @click="logout" style="width: calc(100% - 30px); margin: 15px;"
      :text="$t('settings.logout')" />

    <van-dialog v-bind:show="showCleanCahe" title="" message="清理缓存可能需要一些时间，清理过程中请耐心等候" show-cancel-button
      @cancel="showCleanCahe = false" :before-close="clean" @confirm="cleanCache"/>
  </van-col>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useCommonStore, useIMStore } from '../../store';

const commonStore = useCommonStore()
const i18n = useI18n()
const router = useRouter()

const showCleanCahe = ref(false)
const cacheSize = ref('0 kb')
const cleaning = ref(false)

onMounted(() => {
  commonStore.navbar.title = i18n.t('settings.title')

  getCacheSize()

})

async function getCacheSize() {
  let result = await navigator.storage.estimate()

  let size = result.usage / (1024 * 1024)
  if (Number.parseFloat(size.toFixed(2)) >= 1) {
    cacheSize.value = `${size.toFixed(2)} M`
  } else {
    size = result.usage / 1024
    cacheSize.value = `${size.toFixed(0)} KB`
  }
}

async function clean() {
  try {
    await getCacheSize()
    return true
  } catch (err) {
    return false
  }
}

async function cleanCache() {
  await useIMStore().cleanCache()
  showCleanCahe.value = false
}

function logout() {
  commonStore.logout()
  router.replace('/iot')
}


</script>
<style scoped>

</style>