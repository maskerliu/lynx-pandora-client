<template>
  <van-col>
    <span>{{ `TODO` }}</span>
  </van-col>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { Timeline } from '../../models'

defineProps<{
  post: Timeline.Post
}>()

onMounted(() => {

})

</script>
<style scoped>

</style>