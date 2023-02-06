<template>

  <van-col>
    <van-checkbox-group v-model="checked">
      <van-grid :column-num="5" square :border="true" style="height">
        <van-grid-item>
          <van-uploader v-model="image" closeImagePreview :preview-image="false"
            :after-read="() => imStore.addCustomEmoji(image[0].file, null)" @click-upload="openFileSelector">
            <van-icon class="iconfont icon-add" size="2rem" style="padding: 1rem;" color="#636e72" />
          </van-uploader>
        </van-grid-item>
        <van-grid-item v-for="(item, index) in emojis" @click="checkboxRefs[index].toggle()">
          <van-image style="padding: 5px;" round radius="5px"
            :src="`//${commonStore.appConfig?.staticServer + item.snap}`" />

          <van-checkbox class="emoji-check" :name="item._id" :ref="el => checkboxRefs[index] = el" @click.stop
            v-if="isMgr" />
        </van-grid-item>
      </van-grid>
    </van-checkbox-group>

    <van-row class="bottom-bar" justify="space-between" v-if="isMgr">
      <van-button plain size="small" :text="$t('message.emojiMgr.reorder')" @click="reorder" />
      <van-button plain size="small" type="danger" :text="$t('message.emojiMgr.remove')" @click="deleteEmojis" />
    </van-row>
  </van-col>

</template>
<script lang="ts" setup>
import { UploaderFileListItem } from 'vant';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { IM, IMApi } from '../../models';
import { useCommonStore, useIMStore } from '../../store';


const i18n = useI18n()
const commonStore = useCommonStore()
const imStore = useIMStore()

const emojis = ref<Array<IM.IMEmoji>>([])
const isMgr = ref(false)
const checked = ref([])
const checkboxRefs = ref([])
const image = ref<Array<UploaderFileListItem>>([])

onMounted(async () => {
  commonStore.navbar.title = i18n.t('message.emojiMgr.title')
  commonStore.navbar.rightText = i18n.t('message.emojiMgr.mgr')

  commonStore.rightAction = () => {
    isMgr.value = !isMgr.value
    commonStore.navbar.rightText = isMgr.value ? i18n.t('message.emojiMgr.done') : i18n.t('message.emojiMgr.mgr')
  }

  if (window.argus) {
    window.webApp.register(onEmojiFileSelect)
  }

  emojis.value = await imStore.myEmojis() 
})

onBeforeMount(() => {
  if (window.argus) {
    window.webApp.unRegister(onEmojiFileSelect.name)
  }
})

async function openFileSelector() {
  if (window.argus) {
    window.argus.fileSelect(0, 1)
    return
  }
}

async function onEmojiFileSelect(...args: string[]) {
  let resp = await fetch(args[0])
  let blob = await resp.blob()
  let file = new File([blob], 'test.jpeg', { type: blob.type })
  image.value.push({ file, content: args[0] })
  emojis.value = await imStore.addCustomEmoji(image.value[0].file, null)
}

async function reorder() {
  if (checked.value.length > 0)
    emojis.value = await imStore.reorderEmojis(checked.value)
}

async function deleteEmojis() {
  if (checked.value.length > 0)
    emojis.value = await imStore.deleteEmojis(checked.value)
}

</script>
<style scoped>
.emoji-check {
  position: absolute;
  top: 5px;
  right: 5px;
}

.bottom-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: calc(100% - 20px);
  background: white;
  padding: 10px;
}
</style>