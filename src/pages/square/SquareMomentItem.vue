<template>
  <van-col>
    <span>{{ moment.uid }}</span>
  </van-col>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { Timeline } from '../../models'

defineProps<{
  moment: Timeline.Moment
}>()

onMounted(() => {

})

</script>
<style scoped>

</style>