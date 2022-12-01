<template>
  <van-col style="overflow-y: auto">
    <van-cell-group :title="$t('settings.sys.title')">
      <van-cell :title="$t('settings.sys.mqttBroker')" :value="commonStore.appConfig.broker" />
      <van-cell :title="$t('settings.sys.about')" center is-link to="about" />
      <van-cell :title="$t('settings.sys.help')" center is-link to="help" />
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
  </van-col>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useCommonStore } from '../../store';

const commonStore = useCommonStore()
const i18n = useI18n()
const router = useRouter()

const sound = ref(false)
const vibrate = ref(false)

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

function logout() {
  commonStore.logout()
  router.replace('/iot')
}


</script>
<style scoped>

</style>