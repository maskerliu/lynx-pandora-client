<template>
  <iframe :src="url" width="100%" height="100%"></iframe>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useCommonStore } from '../../store';

const route = useRoute()
const commonStore = useCommonStore()
const url = ref('')

onMounted(() => {
  commonStore.navbar.title = route.hash
  url.value = route.params['url'] as string
})


</script>
<style scoped>

</style>