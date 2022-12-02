<template>
  <van-col>
    <van-cell-group title=" ">
      <van-form label-align="right" label-width="5.5rem" colon>
        <van-field :label="$t('mine.profile.avatar')" v-model="commonStore.profile.name" input-align="right">
          <template #input>
            <van-uploader width="4rem" height="4rem" v-model="avatar" :max-count="1" closeImagePreview
              :after-read="uploadAvatar" @click-upload="openFileSelector" />
          </template>
        </van-field>
        <van-field :label="$t('mine.profile.name')" v-model="commonStore.profile.name" input-align="right" />
        <van-field :label="$t('mine.profile.phone')" :maxlength="11" v-model="commonStore.profile.phone"
          input-align="right" />
      </van-form>


      <van-button type="primary" @click="saveProfile" :text="$t('common.save')"
        style="width: calc(100% - 30px); margin: 15px;" />
    </van-cell-group>
  </van-col>
</template>
<script lang="ts" setup>

import { UploaderFileListItem } from 'vant'
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CommonApi } from '../../models'
import { useCommonStore } from '../../store'

const i18n = useI18n()
const commonStore = useCommonStore()
const avatar = ref<Array<UploaderFileListItem>>([])

onMounted(async () => {
  commonStore.navbar.title = i18n.t('mine.profile.title')

  if (commonStore.profile.avatar) {
    avatar.value.push({ url: commonStore.profile.avatar })
  }

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
    window.argus.fileSelect(0, 1)
  }
}

async function onFileSelect(...args: string[]) {
  let resp = await fetch(args[0])
  let blob = await resp.blob()
  let file = new File([blob], 'test.jpeg', { type: blob.type })
  avatar.value.push({ file, content: args[0] })
  await uploadAvatar()
}

async function saveProfile() {
  await CommonApi.saveProfile(commonStore.profile)
}

async function uploadAvatar() {
  console.log(avatar.value[0].file)
  if (avatar.value[0] != null && avatar.value[0].file != null) {
    await CommonApi.uploadAvatar(avatar.value[0].file)
    commonStore.profile = await CommonApi.getMyProfile()
  }
}

</script>
<style scoped>

</style>