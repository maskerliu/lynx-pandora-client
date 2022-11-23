<template>
  <van-col style="overflow-y: auto">
    <van-cell-group :title="$t('settings.sys.title')">
      <van-cell :title="$t('settings.sys.mqttBroker')" :value="commonStore.appConfig.broker" size="large" />
      <van-cell :title="$t('settings.sys.about')" center size="large" is-link to="about" />
      <van-cell :title="$t('settings.sys.help')" center size="large" is-link to="about" />
    </van-cell-group>

    <van-cell-group :title="$t('settings.notify.title')">
      <van-cell :title="$t('settings.notify.sound')" center size="large">
        <template #value>
          <van-switch></van-switch>
        </template>
      </van-cell>
      <van-cell :title="$t('settings.notify.vibrate')" center size="large">
        <template #value>
          <van-switch></van-switch>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group :title="$t('settings.fontlang.title')">
      <van-cell :title="$t('settings.fontlang.fontSize')" center size="large" is-link to="fontSize" />
      <van-cell :title="$t('settings.fontlang.multiLang')" center size="large" is-link to="multiLang" />
    </van-cell-group>

    <van-button plain type="danger" style="width: calc(100% - 30px); margin: 15px;">
      {{ $t('settings.logout') }}
    </van-button>
  </van-col>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useCommonStore } from '../../store';

const commonStore = useCommonStore()

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
  let test = new Test('chris', 'xxxxx')
  let test2 = new Test('tom', 'ooooo')
  Reflect.set(Test.prototype, 'test', new Hello('test'))
  Reflect.set(Test.prototype, 'print', function () {
    console.log(this.name)
  })
  console.log(test['test'])
  test['test'].test = 'world'
  Reflect.apply(Reflect.get(Test.prototype, 'print'), test, [])
  console.log(test2['test'])
  Reflect.apply(Reflect.get(Test.prototype, 'print'), test2, [])


  let ua = 'mapi/1.0(Android 12;com.github.lynxchina.argus 1.0.1;vivo:V2171A;huaiwei)'
  let regArr = ua.match(/[0-9A-Za-z\/.\ :]+/g)
  console.log(regArr)
})

</script>
<style scoped>
.single-line {
  max-width: 80px;
  font-size: 0.7rem;
  color: #34495e;
  padding: 5px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>