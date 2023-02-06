<template>
  <span>
    <van-button round style="width: 35px; height: 35px; margin-left: 15px;" @click="onShowClicked">
      <template #icon>
        <van-icon class="iconfont icon-emoji" size="24" color="#d35400" />
      </template>
    </van-button>

    <van-popup position="bottom" :show="show" :overlay-style="{ background: '#0505052b' }"
      @close="emits('update:show', false)" style="height: 300px;">
      <van-tabs v-model:active="activeTab" shrink style="height: 100%;">
        <van-tab :title="group.name" v-for="group in emojis">
          <template v-if="group.type == EmojiType.Text">
            <div style="height: 254px; overflow-y: auto;">
              <van-grid :column-num="6" clickable square :border="false"
                style="margin-top: 10px; padding: 0;" v-for="(emojiGroup, category) in group.emojis">
                <van-grid-item v-for="(emoji, _) in emojiGroup" @click="onTextEmojiSelected(emoji)">
                  <span style="font-size: 1.8rem; padding: 10px;">{{ emoji }}</span>
                </van-grid-item>
              </van-grid>
            </div>
          </template>
          <template v-else-if="group.type == EmojiType.Custom">
            <van-grid :column-num="5" clickable square :border="true" style="margin-top: 10px;">
              <van-grid-item @click="gotoEmojiMgr">
                <van-icon class="iconfont icon-add" size="2rem" style="padding: 1rem;" />
              </van-grid-item>
              <van-grid-item v-for="item in group.emojis" @click="sendCustomEmoji(item)">
                <van-image style="padding: 5px;" round radius="5px"
                  :src="`//${commonStore.appConfig?.staticServer + item.snap}`" />
              </van-grid-item>
            </van-grid>
          </template>
        </van-tab>
      </van-tabs>
    </van-popup>
  </span>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { IM } from '../../models';
import router from '../../router';
import { useCommonStore, useIMStore } from '../../store';
import TxtEmojis from './emojis';

const props = defineProps<{
  sid: string
  show: boolean
  textEmoji?: string
}>()

const emits = defineEmits(['update:show', 'update:textEmoji'])

enum EmojiType {
  Text,
  Custom
}

type IMEmojiGroup = {
  name: string
  type: EmojiType
  emojis: any | Array<IM.IMEmoji>
}

const commonStore = useCommonStore()
const imStore = useIMStore()
const activeTab = ref(0)
const emojis = ref<Array<IMEmojiGroup>>([])

onMounted(async () => {
  emojis.value.push({ name: '通用', type: EmojiType.Text, emojis: TxtEmojis })
  emojis.value.push({ name: '我的', type: EmojiType.Custom, emojis: await imStore.myEmojis() })
})


function onShowClicked() {
  emits('update:show', !props.show)
}

async function onTextEmojiSelected(item: string) {
  emits('update:textEmoji', item)
}

async function sendCustomEmoji(item: IM.IMEmoji) {
  let msg: IM.Message = {
    sid: props.sid,
    uid: commonStore.profile.uid,
    type: IM.MessageType.EMOJI,
    content: item.gif ? item.gif : item.snap,
    timestamp: new Date().getTime()
  }
  await imStore.sendMessage(msg)
  emits('update:show', false)
}

async function gotoEmojiMgr() {
  emits('update:show', false)
  setTimeout(() => { router.push({ name: 'IMEmojiMgr' }) }, 350)

}

</script>
<style scoped>

</style>