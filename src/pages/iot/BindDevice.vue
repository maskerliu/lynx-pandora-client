<template>
  <van-form>
      <van-field :label="$t('iot.device.name')" v-model="device.deviceId">
        <template #button>
          <van-icon class="iconfont icon-scan" size="20" @click="scan" />
        </template>
      </van-field>
      <van-cell :title="$t('iot.device.address')" :title-style="{ maxWidth: '100px' }" center clickable>
        <template #value>
          <div class="van-ellipsis" style="width: 100%;">{{ device.address }}</div>
        </template>
      </van-cell>
      <amap-viewer style="width: 100%; height: 300px; margin: 15px 0;" v-model:lng="device.lng" v-model:lat="device.lat"
        v-model:address="device.address" />

      <van-button type="primary" :text="$t('common.bind')" @click="bind"
        style="width: calc(100% - 30px); margin: 15px;" />
    </van-form>
</template>
<script lang="ts" setup>

import AmapViewer from '../components/AmapViewer.vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { IOT, IOTApi } from '../../models'
import { useCommonStore } from '../../store'
import { useI18n } from 'vue-i18n'
import { Notify } from 'vant'

const commonStore = useCommonStore()
const i18n = useI18n()
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
