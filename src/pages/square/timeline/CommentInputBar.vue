<template>
  <van-cell-group v-if="show" inset style="width: 100%; position: fixed; bottom: 0; margin: 0;">
    <van-field ref="inputBar" v-model="content" row="1" autofocus autosize :placeholder="placeholder"
      @blur="emits('update:show', false)">
      <template #button>
        <van-button plain type="success" size="small" :text="$t('common.send')" :disabled="content?.length == 0"
          @click="sendComment" />
      </template>
    </van-field>
  </van-cell-group>

</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { Timeline, TimelineApi } from '../../../models';
import { useCommonStore } from '../../../store';
import type { Field } from 'vant'
const props = defineProps<{
  show: boolean
  metionedComment?: Timeline.Comment
}>()

const emits = defineEmits(['update:show'])

const commonStore = useCommonStore()
const placeholder = ref('')
const content = ref('')
const inputBar = ref()


onMounted(() => {
  // placeholder.value = props.metionedComment != null ? `回复 ${props.metionedComment.name}` : '评论'
  console.log(inputBar.value)
})

watch(() => props.show, () => {
  if (props.show) {
    
    inputBar.value?.focus()
  }
})

watch(() => props.metionedComment, () => {
  placeholder.value = props.metionedComment != null ? `回复 ${props.metionedComment.name}` : '评论'
})

async function sendComment() {

  let comment: Timeline.Comment = {
    uid: commonStore.profile.uid,
    name: commonStore.profile.name,
    content: content.value,
    timestamp: new Date().getTime()
  }
  if (props.metionedComment != null) {
    comment.mention = props.metionedComment.uid
    comment.mentionName = props.metionedComment.name
  }

  // await TimelineApi.commentPub(comment)

  content.value = ''
  emits('update:show', false)
}

</script>
<style scoped>

</style>