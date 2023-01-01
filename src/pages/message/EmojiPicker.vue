<template>
  <div class="emoji-panel">
    <div class="emoji-category" v-for="(emojiGroup, category) in emojis" :key="category">
      <h5>{{ category }}</h5>
      <van-row style="margin-right: -18px;">
        <div class="emoji-item" v-for="(emoji, emojiName) in emojiGroup" :key="emojiName" :title="emojiName"
          @click="onItemSelected(emoji)">
          {{ emoji }}
        </div>
      </van-row>
    </div>
  </div>
</template>
<script lang="ts" setup>
import emojis from './emojis'

withDefaults(defineProps<{
  emoji: String
  emojiTable?: any,
}>(), {
  emojiTable: () => emojis
})

const emits = defineEmits(['update:emoji'])

function onItemSelected(item: any) {
  emits('update:emoji', item)
}

</script>
<style scoped>
.emoji-category {
  padding-left: 30px;
}

.emoji-item {
  font-size: 1.8rem;
  margin: 18px 18px 0 0;
  cursor: pointer;
}
</style>