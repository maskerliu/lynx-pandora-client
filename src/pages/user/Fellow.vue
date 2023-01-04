<template>

  <van-col>


  </van-col>

</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { useCommonStore } from '../../store'

const commonStore = useCommonStore()

onMounted(() => {
  commonStore.navbar.title = '会员等级'
})

</script>
<style scoped>

</style>