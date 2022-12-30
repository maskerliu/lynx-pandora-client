<template>
  <van-col>
    <van-form label-align="right" label-width="4.8rem" colon style="background: white;">
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
    </van-form>

    <van-button type="primary" :text="$t('common.bind')" @click="bind"
      style="width: calc(100% - 30px); margin: 15px;" />
  </van-col>
</template>
<script lang="ts" setup>
import { showNotify } from 'vant'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { IOT, IOTApi } from '../../models'
import { useCommonStore } from '../../store'
import AmapViewer from '../components/AmapViewer.vue'


const commonStore = useCommonStore()
const i18n = useI18n()
const device = ref<IOT.Device>({
  lat: 32.1323, lng: 121.4232
})

onMounted(() => {
  commonStore.navbar.title = i18n.t('mine.bindDevice')
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
  showNotify({ type: 'success', message: '绑定成功' })

  device.value = { lat: 32.1323, lng: 121.4232 }
}
</script>
<style scoped>

</style>
