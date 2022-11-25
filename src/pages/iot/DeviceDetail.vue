<template>
  <van-col style="overflow-y: auto; overflow-x: hidden;" justify="center" align="center">
    <van-cell-group v-if="curDevice != null" style="margin-top: 5px;">
      <van-cell :title="$t('iot.device.name')" :title-style="{ maxWidth: '100px' }" center>
        <template #value>
          <div class="single-line">{{ curDevice.deviceId }}</div>
        </template>
        <template #right-icon>
          <van-switch v-model="isSubscribe" size="24px">
            <template #node>
              <div class="icon-wrapper">
                <van-icon size="24" class="iconfont"
                  v-bind:class="isSubscribe ? 'icon-subscribed' : 'icon-subscribe'" />
              </div>
            </template>
          </van-switch>
        </template>
      </van-cell>
      <van-cell :title="$t('iot.device.company')" :title-style="{ maxWidth: '100px' }" center is-link to="/company">
        <template #value>
          <div class="single-line">{{ commonStore.company.name }}</div>
        </template>
      </van-cell>

      <van-collapse v-model="showMap" accordion>
        <van-collapse-item name="1" center>
          <template #title>
            <van-cell :title="$t('iot.device.address')" :title-style="{ maxWidth: '80px' }" center clickable
              style="padding: 0; width: calc(100vw - 80px);">
              <template #value>
                <div class="single-line" style="max-width: calc(100vw - 120px);">{{ curDevice.address }}</div>
              </template>
            </van-cell>
          </template>
          <amap-viewer style="width: calc(100vw - 36px); height: 300px;" v-model:lng="curDevice.lng"
            v-model:lat="curDevice.lat" v-model:address="curDevice.address" />
          <van-button type="success" :loading="updating" @click="updateDeviceInfo"
            :text="$t('common.done')" style="width: 100%; margin: 15px 0;" />
        </van-collapse-item>
      </van-collapse>
    </van-cell-group>

    <div ref="echartsElectric" class="chart-container" />
    <div ref="echartsTemperature" class="chart-container" />
    <div ref="echartsHumidity" class="chart-container" />

    <van-dialog v-model:show="removeConfirmDialog" :title="$t('iot.device.delete.title')" show-cancel-button
      :cancel-button-text="$t('common.cancel')" :confirmButtonText="$t('common.delete')" confirmButtonColor="#ee0a24"
      @confirm="deleteDevice">
      <div style="font-size: 0.8rem; padding: 15px;">
        <p>{{ $t('iot.device.delete.confirm', { deviceId: curDevice.deviceId }) }}</p>
        <p>{{ $t('iot.device.delete.confirm1') }}</p>
      </div>
    </van-dialog>

  </van-col>
</template>

<script lang="ts" setup>
import { BarChart, BarSeriesOption, GaugeChart, GaugeSeriesOption, LineChart, LineSeriesOption } from 'echarts/charts'
import {
  DatasetComponent, DatasetComponentOption,
  GridComponent, GridComponentOption,
  LegendComponent, LegendComponentOption,
  TitleComponent, TitleComponentOption,
  TooltipComponent, TooltipComponentOption,
  TransformComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { Notify } from 'vant'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { IOT, IOTApi } from '../../models'
import { useCommonStore } from '../../store'
import { useIOTDeviceStore } from '../../store/IOTDevices'
import AmapViewer from '../components/AmapViewer.vue'


type ECOption = echarts.ComposeOption<BarSeriesOption | LineSeriesOption | TitleComponentOption | TooltipComponentOption | GridComponentOption | DatasetComponentOption | LegendComponentOption | GaugeSeriesOption>

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  LabelLayout,
  GaugeChart,
  UniversalTransition,
  CanvasRenderer,
])

// const AmapViewer = defineAsyncComponent(() => import('../components/AmapViewer.vue'))
const route = useRoute()

const echartsElectric = ref()
const echartsTemperature = ref()
const echartsHumidity = ref()

const isSubscribe = ref(false)
const searchKey = ref('')
const showInfoDialog = ref(false)
const removeConfirmDialog = ref(false)
const curDevice = ref<IOT.Device>(null)
const updating = ref(false)
const showMap = ref()

let electricOpts: any = {}
let electricChart: echarts.ECharts = null

let tempOpts: any = {}
let tempChart: echarts.ECharts = null

let humidityOpts: any = {}
let humidityChart: echarts.ECharts = null

const deviceStore = useIOTDeviceStore()
const commonStore = useCommonStore()
const i18n = useI18n()

onMounted(async () => {

  commonStore.navbar.title = i18n.t('iot.device.title')

  initElectric()
  initTemperature()
  initHumidity()

  curDevice.value = await IOTApi.deviceInfo(route.params['did'] as string)
})

watch(() => isSubscribe.value, () => {
  if (curDevice.value != null) {
    if (isSubscribe.value) {
      commonStore.deviceTmpSubscribe(curDevice.value.deviceId)
    } else {
      commonStore.deviceTmpUnsubscribe(curDevice.value.deviceId)
    }
  }
})

watch(() => deviceStore.temperature, () => {
  updateData()
})

function initElectric() {
  electricOpts = {
    title: {
      text: '电机',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
      },
    },
    legend: {
      data: ['电流', '电压',]
    },
    grid: {
      left: '4%',
      right: '4%',
      bottom: '2%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: [
      {
        type: 'value',
        name: '-/mA',
      },
      {
        type: 'value',
        name: '-/V',
      }
    ],
    series: [
      {
        name: '电流',
        type: 'line',
        color: ["#eb9f0d"],
        smooth: true,
        data: []
      },
      {
        name: '电压',
        type: 'line',
        color: ["#969ac7"],
        smooth: true,
        yAxisIndex: 1,
        data: []
      }
    ]
  }

  electricChart = echarts.init(echartsElectric.value)
  electricChart.setOption(electricOpts)
}

function initTemperature() {
  tempOpts = {
    title: {
      text: '温度',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
      },
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '2%',
      containLabel: true
    },
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 60,
        itemStyle: {
          color: '#FD7347'
        },
        progress: {
          show: true,
          width: 8
        },
        pointer: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        detail: {
          show: false
        },
      },
      {
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 60,
        splitNumber: 12,
        itemStyle: {
          color: '#FFAB9155'
        },
        progress: {
          show: true,
          width: 30
        },

        pointer: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 30
          }
        },
        axisTick: {
          distance: -45,
          splitNumber: 5,
          lineStyle: {
            width: 1,
            color: '#999'
          }
        },
        splitLine: {
          distance: -52,
          length: 14,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        axisLabel: {
          distance: -8,
          color: '#999',
          fontSize: 12
        },
        anchor: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          width: '50%',
          lineHeight: 40,
          borderRadius: 8,
          offsetCenter: [0, '-15%'],
          fontSize: 16,
          fontWeight: 'bolder',
          formatter: '{value} °C',
          color: 'inherit'
        },
      },
    ]
  }
  tempChart = echarts.init(echartsTemperature.value)
  tempChart.setOption(tempOpts)
}

function initHumidity() {
  humidityOpts = {
    title: {
      text: '湿度',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
      },
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '2%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
    },
    series: {
      type: 'line',
      smooth: true,
      data: []
    }

  }

  humidityChart = echarts.init(echartsHumidity.value)
  humidityChart.setOption(humidityOpts)
}

async function onDeviceSelected(device: IOT.Device) {
  if (curDevice.value == null || curDevice.value.deviceId != device.deviceId) {
    // this.curDevice = await deviceInfo(deviceId)
    curDevice.value = device
    deviceStore.updateDevice(curDevice.value.deviceId)
    isSubscribe.value = true
    commonStore.deviceTmpSubscribe(curDevice.value.deviceId)
  }
}

async function updateDeviceInfo() {
  updating.value = true
  try {
    await IOTApi.updateDevice(curDevice.value)
  } catch (err) {

  } finally {
    updating.value = false
    showMap.value = null
  }
}

function showRemoveConfirm(device: IOT.Device) {
  removeConfirmDialog.value = true
  curDevice.value = device
  deviceStore.updateDevice(curDevice.value.deviceId)
}

async function deleteDevice() {
  try {
    let result = await IOTApi.removeDevice(curDevice.value.deviceId)
    curDevice.value = null
    isSubscribe.value = false
    Notify({ type: 'success', message: result, duration: 500 })
  } catch (err) {
    Notify({ type: 'warning', message: err as string, duration: 500 })
  }
  removeConfirmDialog.value = false
}

function updateData() {
  if (tempOpts.series[0].data == null) {
    tempOpts.series[1].data = [{ value: deviceStore.temperature }]
  } else {
    tempOpts.series[1].data = tempOpts.series[0].data
  }
  tempOpts.series[0].data = [{ value: deviceStore.temperature }]
  tempChart.setOption(tempOpts)


  electricOpts.xAxis.data = deviceStore.xAxisLabel
  electricOpts.series[0].data = deviceStore.voltageData
  electricOpts.series[1].data = deviceStore.electricData
  electricChart.setOption(electricOpts)

  humidityOpts.xAxis.data = deviceStore.xAxisLabel
  humidityOpts.series.data = deviceStore.humidityData
  humidityChart.setOption(humidityOpts)
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
  max-width: calc(100vw - 100px);
  /* font-size: 0.7rem; */
  /* color: #34495e; */
  padding: 5px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chart-container {
  width: calc(100vw - 30px);
  height: 260px;
  padding: 15px;
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