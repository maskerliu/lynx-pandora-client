<template>
  <van-col style="overflow-y: auto">
    <van-cell-group :title="$t('settings.sys.title')">
      <van-cell :title="$t('settings.sys.mqttBroker')" :value="commonStore.appConfig.broker" />
      <van-cell :title="$t('settings.sys.about')" center is-link to="about" />
      <van-cell :title="$t('settings.sys.help')" center is-link to="help" />
      <van-cell :title="$t('settings.sys.cleanCache')" center clickable value="5M" @click="showCleanCahe = true" />
    </van-cell-group>

    <van-cell-group :title="$t('settings.notify.title')">
      <van-cell :title="$t('settings.notify.sound')" center>
        <template #value>
          <van-switch size="20px" v-model="commonStore.sharePrefs.sound" />
        </template>
      </van-cell>
      <van-cell :title="$t('settings.notify.vibrate')">
        <template #value>
          <van-switch size="20px" v-model="commonStore.sharePrefs.vibrate" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group :title="$t('settings.fontlang.title')">
      <van-cell :title="$t('settings.fontlang.fontSize')" center is-link to="fontSize" />
      <van-cell :title="$t('settings.fontlang.multiLang')" center is-link to="multiLang" />
    </van-cell-group>

    <van-button type="danger" @click="logout" style="width: calc(100% - 30px); margin: 15px;"
      :text="$t('settings.logout')" />

    <van-dialog v-bind:show="showCleanCahe" title="" message="清理缓存可能需要一些时间，清理过程中请耐心等候" show-cancel-button
      @cancel="showCleanCahe = false" @confirm="cleanCache" />
  </van-col>
</template>

<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue';
import { CommonStore, I18n, VueRouter } from '../components/misc';

const commonStore = inject(CommonStore)
const i18n = inject(I18n)
const router = inject(VueRouter)
const showCleanCahe = ref(false)

class Test {
  name: string
  title: string

  constructor(name?: string, title?: string) {
    this.name = name
    this.title = title
  }
}

class Hello {
  test: string

  constructor(test: string) {
    this.test = test
  }
}

onMounted(() => {
  commonStore.navbar.title = i18n.t('settings.title')

  // let a = { id: '1111' }
  // let b = { id: '22222' }
  // console.log(Object.assign(a, b))

  // let test = new Test('chris', 'xxxxx')
  // let test2 = new Test('tom', 'ooooo')
  // Reflect.set(Test.prototype, 'test', new Hello('test'))
  // Reflect.set(Test.prototype, 'print', function () {
  //   console.log(this.name)
  // })
  // console.log(test['test'])
  // test['test'].test = 'world'
  // Reflect.apply(Reflect.get(Test.prototype, 'print'), test, [])
  // console.log(test2['test'])
  // Reflect.apply(Reflect.get(Test.prototype, 'print'), test2, [])


  // let ua = 'mapi/1.0(Android 12;com.github.lynxchina.argus 1.0.1;vivo:V2171A;huaiwei)'
  // let regArr = ua.match(/[0-9A-Za-z\/.\ :]+/g)
  // console.log(regArr)
})

function cleanCache() {

  showCleanCahe.value = false
}

function logout() {
  commonStore.logout()
  router.replace('/iot')
}


</script>
<style scoped>

</style>