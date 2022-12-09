<template>
  <van-col justify="center" style="background-color: white;">
    <van-search v-model="searchKey" :placeholder="$t('common.searchPlaceholder')" />
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="height: calc(100% - 54px);">
      <van-list clickable style="height: 100%; overflow-y: auto; overflow-x: hidden;">
        <van-cell v-for="item in devices" is-link center :to="`/iot/device/${item.deviceId}`"
          :title-style="{ maxWidth: 'calc(100vw - 200px)', }">
          <template #title>
            <div class="van-ellipsis">
              {{ item.deviceId }}
            </div>
          </template>
          <template #label>
            <div class="van-ellipsis" style="font-size: 0.7rem; ">
              地址:{{ item.address }}
            </div>
          </template>
          <template #value style="width: 100px;">
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
      @confirm="removeDevice">
      <div style="font-size: 0.8rem; padding: 15px;">
        <p>{{ $t('iot.device.delete.confirm', { deviceId: curDevice!.deviceId }) }}</p>
        <p>{{ $t('iot.device.delete.confirm1') }}</p>
      </div>
    </van-dialog>

  </van-col>
</template>

<script lang="ts" setup>
import { Notify } from 'vant';
import { onMounted, ref, watch } from 'vue';
import { IOT, IOTApi } from '../../models';
import { useCommonStore } from '../../store';

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
  devices.value = await IOTApi.searchDevices(searchKey.value)
  loading.value = false
  refreshing.value = false
}

function showRemoveConfirm(device: IOT.Device) {
  removeConfirmDialog.value = true
  curDevice.value = device
}

async function removeDevice() {
  try {
    let result = await IOTApi.removeDevice(curDevice.value!._id)
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