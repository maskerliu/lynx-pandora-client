<template>
  <van-col class="full-row">
    <van-cell-group title=" ">
      <van-form label-align="right" label-width="5.5rem" colon>
        <van-field :label="$t('mine.profile.avatar')" v-model="commonStore.profile.name" input-align="right">
          <template #input>
            <van-uploader width="4rem" height="4rem" v-model="avatar" :max-count="1" :after-read="uploadAvatar" />
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
import { onMounted, ref } from 'vue'
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
})

async function saveProfile() {
  await CommonApi.saveProfile(commonStore.profile)
}

async function uploadAvatar() {
  if (avatar.value[0] != null && avatar.value[0].file != null) {
    await CommonApi.uploadAvatar(avatar.value[0].file)
    commonStore.profile = await CommonApi.getMyProfile()
  }
}

</script>
<style scoped>

</style>