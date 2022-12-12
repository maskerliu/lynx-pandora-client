<template>
  <van-tabs v-model:active="active" style="width: 100%;">
    <van-tab style="padding: 10px;">
      <template #title>
        <van-icon class="iconfont icon-feedback" /> {{ $t('settings.help.feedback') }}
      </template>

      <p style="font-size: 1rem; color: #2d3436">{{ $t('settings.help.feedbackTitle') }}</p>
      <van-field v-model="message" rows="5" autosize type="textarea" maxlength="500"
        :placeholder="$t('settings.help.feedbackPlaceholder')" show-word-limit />
      <p style="font-size: 1rem; color: #2d3436">{{ $t('settings.help.feedbackSnaps') }}</p>
      <van-uploader v-model="images" :max-count="3" @click-upload="openFileSelector" />

      <van-button block style="" :text="$t('common.submit')" @click="submit" />
    </van-tab>
    <van-tab>
      <template #title>
        <van-icon class="iconfont icon-chat" /> {{ $t('settings.help.onlineHelp') }}
      </template>
    </van-tab>
  </van-tabs>
</template>
<script lang="ts" setup>
import { UploaderFileListItem } from 'vant';
import { inject, onMounted, onUnmounted, ref } from 'vue';
import { CommonStore, I18n } from '../components/misc';

const commonStore = inject(CommonStore)
const i18n = inject(I18n)

const active = ref(0)
const message = ref('')
const images = ref<Array<UploaderFileListItem>>([])

onMounted(() => {
  commonStore.navbar.title = i18n.t('settings.sys.help')

  if (window.argus) {
    window.webApp.register(onFileSelect)
  }
})

onUnmounted(async () => {
  if (window.argus) {
    window.webApp.unRegister(onFileSelect.name)
  }
})

function openFileSelector() {
  if (window.argus) {
    window.argus.fileSelect(0, 3)
  }
}

async function onFileSelect(...args: string[]) {
  args.forEach(async (item) => {
    let resp = await fetch(item)
    let blob = await resp.blob()
    let file = new File([blob], 'test.jpeg', { type: blob.type })
    images.value.push({ file, content: item })
  })
}

async function submit() {
  console.log(images.value)
}

</script>
<style scoped>

</style>