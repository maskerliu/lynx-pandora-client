<template>
  <biz-main v-if="canRender" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import BizMain from './pages/BizMain.vue';
import { useCommonStore } from './store';

const canRender = ref(true)

onMounted(() => {
  canRender.value = true
  useCommonStore().init()
})
</script>

<style>
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  scrollbar-arrow-color: red;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  box-shadow: inset 0 0 5px rgba(125, 125, 125, 0.1);
  -webkit-box-shadow: inset 0 0 5px rgba(125, 125, 125, 0.1);
  background: rgba(0, 0, 0, 0.2);
  scrollbar-arrow-color: red;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(125, 125, 125, 0.2);
  -webkit-box-shadow: inset 0 0 5px rgba(125, 125, 125, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}

#app {
  font-family: "Microsoft YaHei", 微软雅黑, "MicrosoftJhengHei", 华文细黑,
    STHeiti, MingLiu, monospace;
  background: transparent;
  letter-spacing: 1px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

:root {
  --van-dialog-border-radius: 4px;
  --van-tag-font-size: 0.6rem;
  --van-tag-padding: 2px 5px;
  --van-tag-border-radius: 5px;
}

.full-row {
  width: 100%;
  height: 100%;
  background: #eee;
  overflow: hidden;
}

.bg-border {
  margin: 5px;
  padding: 0;
  border-radius: 8px;
  border: 1px solid #efefef;
  box-shadow: 0px 12px 8px -12px #000;
}

</style>
