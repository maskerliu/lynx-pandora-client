<template>

  <van-popup :show="show" position="bottom" round @close="emits('update:show', false)"
    style="width: 100%; height: 50%; padding-top: 15px;">
    <van-cell-group>
      <van-form label-align="right" label-width="5.5rem" colon>
        <van-field :label="$t('channel.room.create.name')" :placeholder="$t('channel.room.create.namePlaceholder')"
          v-model="roomInfo.title" />
        <van-field :label="$t('channel.room.create.notice')" :placeholder="$t('channel.room.create.noticePlaceholder')"
          type="textarea" rows="2" maxlength="100" show-word-limit v-model="roomInfo.notice" />
        <van-field :label="$t('channel.room.create.cover')" input-align="right">
          <template #input>
            <van-uploader width="4rem" height="4rem" v-model="cover" :max-count="1" closeImagePreview
              @click-upload="openFileSelector" />
          </template>
        </van-field>

        <van-field :label="$t('channel.room.create.tags')" />
      </van-form>
    </van-cell-group>
    <van-button type="success" style="position: absolute; bottom: 0; width: calc(100% - 30px); margin: 15px;" text="提交申请" />
  </van-popup>
</template>
<script lang="ts" setup>
import { UploaderFileListItem } from 'vant'
import { onMounted, onUnmounted, ref } from 'vue'
import { Channel } from '../../models'

defineProps<{
  show: boolean
}>()

const emits = defineEmits(['update:show'])

const cover = ref<Array<UploaderFileListItem>>([])
const roomInfo = ref<Channel.Room>({})

onMounted(() => {
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
  cover.value.push({ file, content: args[0] })
  // await uploadAvatar()
}

</script>
<style scoped>

</style>