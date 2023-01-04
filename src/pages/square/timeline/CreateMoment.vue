<template>

  <van-col>
    <van-field type="textarea" row="2" maxlength="200" v-model:input="moment.desc" placeholder="这一刻的想法" />
    <van-uploader v-model="images" :max-count="9" @click-upload="openFileSelector" />

    <van-button type="success" style="width: calc(100% - 30px); margin: 15px; position: fixed; bottom: 0; left: 0;"
      text="发表" />
  </van-col>
</template>
<script lang="ts" setup>
import { UploaderFileListItem } from 'vant'
import { onMounted, onUnmounted, ref } from 'vue'
import { Timeline } from '../../../models'
import { useCommonStore } from '../../../store'

const commonStore = useCommonStore()
const images = ref<Array<UploaderFileListItem>>([])
const moment = ref<Timeline.Moment>({ uid: commonStore.profile?.uid })

onMounted(() => {
  commonStore.navbar.title = '发表想法'

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

</script>
<style scoped>

</style>