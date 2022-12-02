<template>
  <van-col>
    <van-nav-bar v-show="showNavbar" class="animate__animated"
      v-bind:class="showNavbar ? 'animate__fadeInDown' : 'animate__fadeOutUp'" :title="commonStore.navbar.title"
      :left-arrow="commonStore.navbar.leftArrow" @click-left="back">
    </van-nav-bar>
    <router-view class="biz-content" v-bind:style="{ height: `calc(100vh - ${height}px)` }"
      v-slot="{ Component, route }">
      <transition :name="route.meta.animate">
        <keep-alive :include="['DeviceMgr', 'Mine']">
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>

    <van-tabbar route v-model="active" v-show="showTabbar" class="animate__animated"
      v-bind:class="showTabbar ? 'animate__fadeInUp' : 'animate__fadeOutDown'">
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
    <van-popup position="bottom" style="width: 100%; height: 560px; background-color: #f1f1f1;"
      v-model:show="commonStore.needLogin">
      <login />
    </van-popup>
    <debug-panel />
  </van-col>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCommonStore } from '../store'
import DebugPanel from './components/DebugPanel.vue'
import Login from './user/Login.vue'

const commonStore = useCommonStore()
const active = ref(0)
const showTabbar = ref(true)
const showNavbar = ref(false)
const router = useRouter()
const height = ref(0)

let animate = null

onMounted(() => {
  window.webApp.back = back
  router.replace("/mine")
  active.value = 1
})

onUnmounted(() => {

})

window.addEventListener('popstate', (event) => {
  animate = null
})

router.beforeEach((to, from) => {
  showTabbar.value = to.meta.tabBar ? to.meta.tabBar : false
  showNavbar.value = to.meta.navBar ? to.meta.navBar : false

  commonStore.navbar.title = null
  commonStore.navbar.leftArrow = true
  commonStore.navbar.rightText = null
  commonStore.needLogin = to.meta.needAuth == true && commonStore.accessToken == null

  height.value = showNavbar.value ? 55 : 0
  height.value += showTabbar.value ? 55 : 0

  return !commonStore.needLogin
})

router.afterEach((to, from) => {
  if (animate == null) {
    to.meta.animate = window.history.state.replaced ? null : 'slide-in'
  } else {
    to.meta.animate = animate
  }
})

function back() {
  animate = 'slide-out'
  router.back()
}

</script>

<style scoped>
.biz-content {
  width: 100%;
  margin: 0px 0 50px 0;
  background: #f6f6f6;
  overflow-y: hidden;
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.5s ease-in-out;
}

.slide-in-enter-to {
  position: absolute;
  right: 0;
}

.slide-in-enter-from {
  position: absolute;
  right: -100%;
}

.slide-in-leave-to {
  position: absolute;
  left: -100%;
}

.slide-in-leave-from {
  position: absolute;
  left: 0;
}


.slide-out-enter-active,
.slide-out-leave-active {
  transition: all 0.5s ease-in-out;
}

.slide-out-enter-to {
  position: absolute;
  left: 0;
}

.slide-out-enter-from {
  position: absolute;
  left: -100%;
}

.slide-out-leave-to {
  position: absolute;
  right: -100%;
}

.slide-out-leave-from {
  position: absolute;
  right: 0;
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
