<template>
  <van-form label-align="right" label-width="4.8rem" colon>
    <van-field :label="$t('iot.device.name')" v-model="device.deviceId" center clearable>
      <template #button>
        <van-icon class="iconfont icon-scan" size="20" @click="scan" />
      </template>
    </van-field>
    <van-field :label="$t('iot.device.address')" center clickable>
      <template #input>
        <div class="van-ellipsis" style="max-width: calc(100vw - 140px);">{{ device.address }}</div>
      </template>
    </van-field>
    <amap-viewer style="width: 100%; height: 300px; margin: 15px 0;" v-model:lng="device.lng" v-model:lat="device.lat"
      v-model:address="device.address" />

    <van-button type="primary" :text="$t('common.bind')" @click="bind"
      style="width: calc(100% - 30px); margin: 15px;" />
  </van-form>
</template>
<script lang="ts" setup>
import { Notify } from 'vant'
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { IOT, IOTApi } from '../../models'
import AmapViewer from '../components/AmapViewer.vue'
import { CommonStore, I18n } from '../components/misc'

const commonStore = inject(CommonStore)
const i18n = inject(I18n)
const device = ref<IOT.Device>({})

onMounted(() => {
  commonStore.navbar.title = i18n.t('mine.bindDevice')
  device.value = { lat: 32.1323, lng: 121.4232 }

  window.webApp.register(onScanResult)
})

onBeforeUnmount(() => {
  window.webApp.unRegister(onScanResult.name)
})

function scan() {
  window.argus?.scan()
}

function onScanResult(result: string) {
  device.value.deviceId = result
}

async function bind() {
  device.value.cid = commonStore.company._id
  await IOTApi.updateDevice(device.value)
  Notify({ type: 'success', message: '绑定成功' })

  device.value = { lat: 32.1323, lng: 121.4232 }
}
</script>
<style scoped>

</style>
