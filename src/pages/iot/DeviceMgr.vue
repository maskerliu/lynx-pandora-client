<template>
  <van-row justify="center" align="center">
    <van-search v-model="searchKey" style="width: 100%" :placeholder="$t('common.searchPlaceholder')"
      background="#4fc08d" />
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="width: 100%; height: calc(100% - 54px);">
      <van-list clickable style=" width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden;">
        <van-cell v-for="item in devices" is-link center :to="`/iot/device/${item.deviceId}`">
          <template #title>
            <div class="single-line">{{ item.deviceId }}</div>
          </template>
          <template #label>
            <div class="single-line" style="font-size: 0.8rem; margin-top: 15px;">地址: item.address item.address
              item.address}</div>
          </template>
          <template #value style="max-width: 100px;">
            <div>
              <van-button type="warning" plain size="small"
                @click.stop.prevent="commonStore.rebootDevice(item.deviceId)">
                <template #icon>
                  <van-icon class="iconfont icon-shut-down" />
                </template>
              </van-button>
              <van-button type="danger" plain size="small" @click.stop.prevent="showRemoveConfirm(item)"
                style="margin: 0 10px 0 20px;">
                <template #icon>
                  <van-icon class="iconfont icon-delete" />
                </template>
              </van-button>
            </div>
          </template>
          <template #icon>
            <van-icon class="iconfont icon-device" color="#1989fa" size="30" style="margin-right: 15px;" />
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>

    <van-dialog v-model:show="removeConfirmDialog" :title="$t('iot.device.delete.title')" show-cancel-button
      :cancel-button-text="$t('common.cancel')" :confirmButtonText="$t('common.delete')" confirmButtonColor="#ee0a24"
      @confirm="deleteDevice">
      <div style="font-size: 0.8rem; padding: 15px;">
        <p>{{ $t('iot.device.delete.confirm', { deviceId: curDevice!.deviceId }) }}</p>
        <p>{{ $t('iot.device.delete.confirm1') }}</p>
      </div>
    </van-dialog>

  </van-row>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

import { Notify } from 'vant'
import { removeDevice, searchDevices } from '../../models/iot.api'
import { IOT } from '../../models/iot.model'
import { useCommonStore } from '../../store'

const searchKey = ref('')
const removeConfirmDialog = ref(false)
const curDevice = ref<IOT.Device>()
const devices = ref<Array<IOT.Device>>([])

const loading = ref(false)
const refreshing = ref(false)

const commonStore = useCommonStore()

onMounted(() => {
  onRefresh()
})

watch(searchKey, () => {
  onRefresh()
})

async function onRefresh() {
  loading.value = true
  refreshing.value = true
  devices.value = await searchDevices(searchKey.value)
  loading.value = false
  refreshing.value = false
}

function showRemoveConfirm(device: IOT.Device) {
  removeConfirmDialog.value = true
  curDevice.value = device
}

async function deleteDevice() {
  try {
    let result = await removeDevice(curDevice.value!.deviceId)
    curDevice.value = undefined
    Notify({ type: 'success', message: result, duration: 500 })
  } catch (err) {
    Notify({ type: 'warning', message: err as string, duration: 500 })
  }
  removeConfirmDialog.value = false
}

</script>
<style scoped>
.device-status {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: green;
}

.single-line {
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100vw - 210px);
  display: block;
  /* direction: rtl; */
}

.icon-wrapper {
  display: flex;
  width: 100%;
  justify-content: center;
}

.icon-subscribe {
  line-height: 24px;
  color: var(--van-gray-5);
}

.icon-subscribed {
  line-height: 24px;
  color: var(--van-blue);
}
</style>