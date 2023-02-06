<template>
  <van-cell-group v-if="show" inset style="width: 100%; position: fixed; bottom: 0; margin: 0;">
    <van-field ref="inputBar" v-model="content" row="1" autofocus autosize :placeholder="placeholder">
      <template #button>
        <van-button plain type="success" size="small" :text="$t('common.send')" :disabled="content?.length == 0"
          @click="sendComment" />
      </template>
    </van-field>
  </van-cell-group>

</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { Square, Timeline, TimelineApi } from '../../../models';
import { useCommonStore, useTimelineStore } from '../../../store';
import { Field, showToast } from 'vant'

const props = defineProps<{
  show: boolean
  type: Timeline.CommentType
  postId?: string
  metionedComment?: Timeline.Comment
}>()

const emits = defineEmits(['update:show', 'update:metionedComment', 'update:postId'])

const commonStore = useCommonStore()
const timelineStore = useTimelineStore()
const placeholder = ref('')
const content = ref('')
const inputBar = ref()


onMounted(() => {
  // placeholder.value = props.metionedComment != null ? `回复 ${props.metionedComment.name}` : '评论'
})

watch(() => props.show, () => {
  if (props.show) {
    inputBar.value?.focus()
  } else {
    emits('update:metionedComment', null)
    emits('update:postId', null)
  }
})

watch(() => props.metionedComment, () => {
  placeholder.value = props.metionedComment != null ? `回复 ${props.metionedComment.name}` : '评论'
})

async function sendComment() {
  let postId = props.postId ? props.postId : props.metionedComment?.postId

  if (postId == null) {
    showToast('请先选择要评论的动态')
    return
  }

  let comment: Timeline.Comment = {
    type: props.type,
    uid: commonStore.profile.uid,
    name: commonStore.profile.name,
    postId,
    content: content.value,
    timestamp: new Date().getTime()
  }

  if (props.metionedComment != null) {
    comment.mention = props.metionedComment.uid
    comment.mentionName = props.metionedComment.name
  }

  timelineStore.pubComment(comment)
  
  content.value = ''
  emits('update:show', false)
}

</script>
<style scoped>

</style>