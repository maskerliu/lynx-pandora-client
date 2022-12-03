<template>
  <biz-main v-if="canRender" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import BizMain from './pages/BizMain.vue';
import { useCommonStore } from './store';

const canRender = ref(false)
const commonStore = useCommonStore()

onMounted(async () => {
  window.webApp.methods = new Map()

  window.webApp.register = (func: Function, thiz: any) => {
    window.webApp.methods.set(Symbol.for(func.name), { func, thiz })
  }

  window.webApp.unRegister = (func: string) => {
    window.webApp.methods.delete(Symbol.for(func))
  }

  window.webApp.initEnv = (token: string, ua: string, did: string) => {
    console.log(token, ua)
  }

  window.webApp.onCallback = (method: string, ...args: any) => {
    let localFunc = window.webApp.methods.get(Symbol.for(method))
    Reflect.apply(localFunc.func, localFunc.thiz, args)
  }

  window.argus?.init()
  
  canRender.value = true
})
</script>

<style>
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  box-shadow: inset 0 0 5px rgba(125, 125, 125, 0.1);
  -webkit-box-shadow: inset 0 0 5px rgba(125, 125, 125, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0px rgba(125, 125, 125, 0.2);
  -webkit-box-shadow: inset 0 0 0px rgba(125, 125, 125, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}

#app {
  background: #f6f6f6;
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
  --van-nav-bar-height: 55px;
  --van-nav-bar-arrow-size: 1.5rem;
  --van-nav-bar-icon-color: rgb(159, 159, 159);
  --van-nav-bar-title-font-size: 1.0rem;
  --van-nav-bar-background: rgb(218, 44, 44);
  --van-tabbar-height: 55px;
  --van-tabbar-background-color: rgb(240, 240, 240);
  --van-tabbar-item-active-background-color: rgb(240, 240, 240);
  --van-dialog-border-radius: 4px;
  --van-tag-font-size: 0.6rem;
  --van-tag-padding: 2px 5px;
  --van-tag-border-radius: 5px;
  --van-cell-font-size: 1rem;
  --van-cell-vertical-padding: 15px;
  --van-cell-horizontal-padding: 15px;
  --van-uploader-delete-icon-size: 1.3rem;
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
