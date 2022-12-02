<template>
  <van-list style="height: 100%; overflow-y: auto;">
    <van-cell :title="item.name" v-for="item in dbs" :value="item.size" is-link
      @click="$router.push(`/dbdoc/${item.name}`)"></van-cell>
  </van-list>

</template>
<script lang="ts" setup>

import { onMounted, ref } from 'vue'
import { CommonApi } from '../../models'
import { useCommonStore } from '../../store'


const commonStore = useCommonStore()
const dbs = ref([])

onMounted(async () => {
  commonStore.navbar.title = 'DB Manage'

  dbs.value = await CommonApi.getAllDBs()
})



</script>
<style scoped>

</style>