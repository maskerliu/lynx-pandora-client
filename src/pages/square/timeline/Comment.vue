<template>
  <van-row class="comment" style="width:100%; padding: 2px; font-size: 0.9rem;" @click="showCommentInputBar(comment)">
    <span class="comment-user">{{ comment.name }}</span>
    <template v-if="comment.mentionName">
      回复 <span class="comment-user">{{ comment.mentionName }}</span>
    </template>
    <span>:</span>
    <div style="color: #353b48; margin-left: 2px;">{{ comment.content }}</div>
  </van-row>
</template>
<script lang="ts" setup>
import { onMounted, inject } from 'vue';
import { Timeline } from '../../../models';
import { ShowCommentInputBar } from '../../components/misc';


const showCommentInputBar = inject(ShowCommentInputBar)

defineProps<{
  comment: Timeline.Comment
}>()

onMounted(() => {

})

</script>
<style scoped>
.comment {
  background: #efeeea;
}

.comment:active {
  background: #dcdde1;
}

/* .comment-user {
  font-weight: bold;
  color: #40739e;
} */
</style>