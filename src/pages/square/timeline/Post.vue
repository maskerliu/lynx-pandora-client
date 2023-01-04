<template></template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { useCommonStore } from '../../../store'

const commonStore = useCommonStore()

onMounted(() => {
  commonStore.navbar.title = '正文'
})

</script>
<style scoped>

</style>