<template>
  <van-col>
    <van-nav-bar class="animate__animated nav-bar"
      v-bind:class="showNavbar ? 'animate__fadeInDown' : 'animate__fadeOutUp'"
      v-bind:style="{background: `${commonStore.navbarBg}`, color: `${commonStore.navbarColor}`}"
      :left-arrow="commonStore.navbar.leftArrow" @click-left="back">
      <template #title>
        <div v-bind:style="{ color: `${commonStore.navbarColor}` }">{{ commonStore.navbar.title }}</div>
      </template>
      <template #right>
        <van-icon size="20" class="iconfont" v-bind:class="commonStore.navbar.rightText"
          @click="commonStore.rightAction" />
      </template>
    </van-nav-bar>

    <router-view class="biz-content" v-bind:class="showNavbar ? 'move-down' : 'move-up'"
      v-bind:style="{ height: `calc(100vh - ${height}px)` }" v-slot="{ Component, route }">
      <suspense>
        <transition :name="route.meta.animate">
          <keep-alive :include="[]">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </suspense>
    </router-view>

    <van-tabbar route v-model="active" class="animate__animated"
      v-bind:class="showTabbar ? 'animate__fadeInUp' : 'animate__fadeOutDown'">
      <van-tabbar-item replace to="/iot">
        <template #icon>
          <van-icon class="iconfont icon-device" size="26" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/message"
        :badge="imStore.unread == 0 ? '' : (imStore.unread > 99 ? '99+' : imStore.unread)">
        <template #icon>
          <van-icon class="iconfont icon-msg-read" size="26" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/square">
        <template #icon>
          <van-icon class="iconfont icon-square" size="26" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/mine">
        <template #icon>
          <van-icon class="iconfont icon-mine" size="26" />
        </template>
      </van-tabbar-item>
    </van-tabbar>

    <login />

    <purchase v-model:show="commonStore.showPurchase" />

    <debug-panel />

  </van-col>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import msgClient from '../common/PahoMsgClient'
import { useChatroomStore, useCommonStore, useIMStore, useIOTStore } from '../store'
import DebugPanel from './components/DebugPanel.vue'
import { NavBack } from './components/misc'
import Login from './user/Login.vue'
import Purchase from './payment/Purchase.vue'

const router = useRouter()
const commonStore = useCommonStore()
const imStore = useIMStore()
const iotStore = useIOTStore()
const i18n = useI18n()

const active = ref(0)
const showTabbar = ref(true)
const showNavbar = ref(false)
const height = ref(0)

let animate = null


provide(NavBack, back)

onMounted(async () => {
  window.webApp.back = back

  if (commonStore.locale == null) {
    commonStore.locale = i18n.locale.value
  } else {
    i18n.locale.value = commonStore.locale
  }

  Promise.all([commonStore.init(), imStore.init()]).then(() => {
    if (msgClient && msgClient.isConnected()) { msgClient.close() }
    msgClient.init(commonStore, imStore, iotStore, useChatroomStore())

    router.replace("/square/myRooms")
  })
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
  commonStore.rightAction = null
  commonStore.navbarBg = 'linear-gradient(0.5turn, #ffffff, #f1f1f1)'
  commonStore.navbarColor = '#2c3e50'

  commonStore.needLogin = to.meta.needAuth != false && commonStore.accessToken == null

  height.value = showNavbar.value ? 55 : 0
  height.value += showTabbar.value ? 55 : 0

  if (commonStore.needLogin) commonStore.forword = to

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
.van-nav-bar::after,
[class*='van-hairline']::after {
  display: none;
}

.biz-content {
  width: 100%;
  margin: 0px 0 50px 0;
  background: #f6f6f6;
  overflow-y: hidden;
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.3s ease-in-out;
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
  transition: all 0.3s ease-in-out;
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

.move-up {
  transition: all 0.3s ease-in-out;
  position: absolute;
  top: 0;
}

.move-down {
  transition: all 0.3s ease-in-out;
  position: absolute;
  top: 55px;
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
