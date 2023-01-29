<template>
  <van-list style="height: 100%; overflow-y: auto;">
    <van-cell title="暮色" label="2022-11-09 09:53" v-for="i in 15" center clickable>
      <template #icon>
        <van-image width="2rem" height="2rem" fit="cover" style="margin-right: 10px;" />
      </template>
      <template #label>
        <div style="font-size: 0.9rem;">回复了您的动态 峰峰啦</div>
        <div style="font-size: 0.9rem; color: #2c3e50; margin-top: 5px;">期待春暖花开</div>
        <div style="margin-top: 5px;">2022-11-09 09:53</div>
      </template>
    </van-cell>
  </van-list>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { useCommonStore } from '../../store'

const commonStore = useCommonStore()

onMounted(() => {
  commonStore.navbar.title = '互动消息'
})

</script>
<style scoped>

</style>