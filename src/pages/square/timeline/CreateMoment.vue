<template>

  <van-col>
    <van-field type="textarea" row="2" maxlength="200" v-model="moment.desc"
      :placeholder="$t('square.moment.create.placeholder')" />
    <van-uploader v-model="images" :max-count="9" @click-upload="openFileSelector" style="padding: 15px;" />

    <van-button type="success" style="width: calc(100% - 30px); margin: 15px; position: fixed; bottom: 0; left: 0;"
      :text="$t('square.moment.create.submit')" @click="submitMoment" />
  </van-col>
</template>
<script lang="ts" setup>
import { showToast, UploaderFileListItem } from 'vant'
import { inject, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Timeline, TimelineApi } from '../../../models'
import { useCommonStore } from '../../../store'
import { NavBack } from '../../components/misc'

const navBack = inject(NavBack)

const i18n = useI18n()
const commonStore = useCommonStore()

const images = ref<Array<UploaderFileListItem>>([])
const moment = ref<Timeline.Moment>({ uid: commonStore.profile?.uid })

onMounted(() => {
  commonStore.navbar.title = i18n.t('square.moment.create.title')

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

async function submitMoment() {
  let imgs = images.value.map(it => { return it.file })

  if (imgs.length == 0 && moment.value.desc?.length == 0) {
    showToast('请至少发布一张图片或说点什么')
    return
  }
  
  await TimelineApi.momentPub(moment.value, imgs)
  navBack()
}

</script>
<style scoped>

</style>