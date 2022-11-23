<template>
  <van-row class="full-row">

    <van-nav-bar ref="navbar" v-if="showNavbar" :title="router.currentRoute.value.name as string" left-arrow
      style="width: 100%;" @click-left="router.back()">
    </van-nav-bar>

    <router-view class="biz-content" v-bind:style="{ height: `calc(100vh - ${height}px)` }"
      v-slot="{ Component, route }">
      <transition name="fade">
        <keep-alive>
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>

    <van-tabbar route v-model="active" v-if="showTabbar">
      <van-tabbar-item replace to="/iot">
        <template #icon>
          <van-icon class="iconfont icon-device" size="26" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/message" badge="5">
        <template #icon>
          <van-icon class="iconfont icon-msg-read" size="26" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/mine">
        <template #icon>
          <van-icon class="iconfont icon-mine" size="26" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
    <van-popup position="bottom" style="width: 100%; height: 560px;" v-model:show="commonStore.needLogin">
      <login />
    </van-popup>
    <debug-panel />
  </van-row>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCommonStore } from '../store';
import DebugPanel from './components/DebugPanel.vue';
import Login from './user/Login.vue';

const commonStore = useCommonStore()
const navbar = ref()
const active = ref(0)
const showTabbar = ref(false)
const showNavbar = ref(false)
const router = useRouter()
const height = ref(0)

onMounted(() => {
  router.replace("/mine")

  active.value = 1
})

router.beforeEach((to: any, from: any) => {
  showTabbar.value = to.meta.tabBar ? to.meta.tabBar : false
  showNavbar.value = to.meta.navBar ? to.meta.navBar : false
  commonStore.needLogin = to.meta.needAuth ? to.meta.needAuth : false
  commonStore.navbar = navbar.value

  height.value = 0
  if (showNavbar.value) {
    height.value += 46
  }

  if (showTabbar.value) {
    height.value += 50
  }
  
  return !commonStore.needLogin
})

</script>

<style scoped>
.biz-content {
  width: 100%;
  margin: 0px 0 50px 0;
  background: #f6f6f6;
  overflow-y: hidden;
}

.fade-enter-active {
  animation: bounce-in 0.5s ease-in;
}

.fade-leave-active {
  animation: bounce-out 0.5s ease-out;
}

@keyframes bounce-in {
  0% {
    opacity: 0.0;
  }

  100% {
    opacity: 1.;
  }
}

@keyframes bounce-out {
  0% {
    opacity: 1.0;
  }

  100% {
    opacity: 0.0;
  }
}
</style>
