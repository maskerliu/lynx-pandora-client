<template>
  <biz-main v-if="canRender" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import BizMain from './pages/BizMain.vue';
import { useCommonStore } from './store';

const canRender = ref(true)
const commonStore = useCommonStore()
const router = useRouter()

onMounted(async () => {
  canRender.value = true
  await commonStore.init()


  window.webApp.methods = new Map()

  window.webApp.register = (func: Function, thiz: any) => {
    window.webApp.methods.set(func.name, { func, thiz })
  }

  window.webApp.unRegister = (func: string) => {
    window.webApp.methods.delete(func)
  }

  window.webApp.back = () => {
    router.back()
  }

  window.webApp.initEnv = (token: string, ua: string, did: string) => {
    console.log(token, ua)
  }

  window.webApp.onCallback = (method: string, ...args: any) => {
    let localFunc = window.webApp.methods.get(method)
    Reflect.apply(localFunc.func, localFunc.thiz, args)
  }

  window.argus?.init()

  let ua = 'mapi/1.0(Android 12;com.github.lynxchina.argus-hello 1.0.1;vivo:V2171A;huaiwei)'
  let regArr = ua.match(/[0-9A-Za-z\/\.\s:-]+/g)
  let [os, version] = regArr[1].split(' ')
  console.log(os, 'hello', version)
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
  --van-nav-bar-height: 55px;
  --van-nav-bar-arrow-size: 1.5rem;
  --van-nav-bar-icon-color: rgb(159, 159, 159);
  --van-nav-bar-title-font-size: 1.0rem;
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
