<template></template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { useCommonStore } from '../../../store'

const commonStore = useCommonStore()

onMounted(() => {
  commonStore.navbar.title = '我的帖子'
  commonStore.navbar.rightText = 'icon-publish'
  commonStore.rightAction = () => {  }
})

</script>
<style scoped>

</style>