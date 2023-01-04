<template>
  <van-col>
    <van-row justify="center" style="padding: 15px;">
      <span style="padding-left: 10px; font-size: 1.5rem; font-weight: bold; font-style: italic; color: #0097e6">
        {{ $n(520188.08, 'currency') }}
      </span>
      <div style="font-size: 0.8rem; margin: auto 5px; color: #bdc3c7"><span>钻石</span></div>
    </van-row>

    <van-list style="height: calc(100% - 134px); overflow-y: auto;">
      <van-cell title="收入 1钻" label="22-12-25" v-for="i in 20" />
    </van-list>

    <van-button type="primary"
      style="position:absolute; bottom: 0; width: calc(100% - 30px); margin: 15px; color: white;" text="兑换钻石" />
  </van-col>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { useCommonStore } from '../../store'

const commonStore = useCommonStore()
onMounted(() => {
  commonStore.navbar.title = '收入明细'

})
</script>
<style scoped>

</style>