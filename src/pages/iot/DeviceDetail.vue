<template>
  <van-col style="overflow-y: auto; overflow-x: hidden;" justify="center" align="center">
    <van-cell-group v-if="curDevice != null" style="margin-top: 2px;">
      <van-cell :title="$t('iot.device.name')" :title-style="{ maxWidth: '80px', textAlign: 'right' }" center>
        <template #value>
          <div class="van-ellipsis" style="margin-left: 15px;">{{ curDevice.deviceId }}</div>
        </template>
        <template #right-icon>
          <van-switch v-model="isSubscribe" size="24px" style="margin-left: 5px;">
            <template #node>
              <div class="icon-wrapper">
                <van-icon size="24" class="iconfont"
                  v-bind:class="isSubscribe ? 'icon-subscribed' : 'icon-subscribe'" />
              </div>
            </template>
          </van-switch>
        </template>
      </van-cell>
      <van-cell :title="$t('iot.device.company')" :title-style="{ maxWidth: '80px', textAlign: 'right' }" center is-link
        to="/iot/company">
        <template #value>
          <div class="van-ellipsis" style="margin-left: 15px;">{{ commonStore.company.name }}</div>
        </template>
      </van-cell>

      <van-collapse v-model="showMap" accordion>
        <van-collapse-item name="1" center :title="$t('iot.device.address')"
          :title-style="{ maxWidth: '80px', textAlign: 'right' }">
          <template #value>
            <div class="van-ellipsis" style="margin-left: 15px; text-align: right;">{{ curDevice.address }}</div>
          </template>
          <amap-viewer style="height: 300px;" v-model:lng="curDevice.lng" v-model:lat="curDevice.lat"
            v-model:address="curDevice.address" />
          <van-button type="success" :loading="updating" @click="updateDeviceInfo" :text="$t('common.done')"
            style="width: calc(100% - 30px); margin: 15px 0;" />
        </van-collapse-item>
      </van-collapse>
    </van-cell-group>

    <div ref="echartsElectric" class="chart-container" />
    <div ref="echartsTemperature" class="chart-container" />
    <div ref="echartsHumidity" class="chart-container" />

  </van-col>
</template>

<script lang="ts" setup>
import { BarChart, GaugeChart, LineChart } from 'echarts/charts'
import {
  DatasetComponent, GridComponent, LegendComponent,
  TitleComponent, TooltipComponent, TransformComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { showNotify } from 'vant'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { IOT, IOTApi } from '../../models'
import { useCommonStore, useIOTStore } from '../../store'
import AmapViewer from '../components/AmapViewer.vue'

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

const route = useRoute()
const commonStore = useCommonStore()
const i18n = useI18n()
const iotStore = useIOTStore()

const echartsElectric = ref()
const echartsTemperature = ref()
const echartsHumidity = ref()

const isSubscribe = ref(false)
const curDevice = ref<IOT.Device>(null)
const updating = ref(false)
const showMap = ref()

let electricOpts: any = {}
let electricChart: echarts.ECharts = null

let tempOpts: any = {}
let tempChart: echarts.ECharts = null

let humidityOpts: any = {}
let humidityChart: echarts.ECharts = null

onMounted(async () => {
  commonStore.navbar.title = i18n.t('iot.device.title')

  initElectric()
  initTemperature()
  initHumidity()

  curDevice.value = await IOTApi.deviceInfo(route.params['did'] as string)
})

watch(isSubscribe, (val, oldVal) => {

  if (curDevice == null) return

  try {
    if (val) {
      iotStore.subscribe(curDevice.value.deviceId)
    } else {
      iotStore.unsubscribe(curDevice.value.deviceId)
    }
  } catch (err) {
    console.log(err)
    isSubscribe.value = oldVal
    showNotify({ type: 'danger', message: '未能链接该设备', duration: 500 })
  }
})

watch(() => iotStore.needUpdate, () => {
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

function updateData() {
  if (tempOpts.series[0].data == null) {
    tempOpts.series[1].data = [{ value: iotStore.temperature }]
  } else {
    tempOpts.series[1].data = tempOpts.series[0].data
  }
  tempOpts.series[0].data = [{ value: iotStore.temperature }]
  tempChart.setOption(tempOpts)


  electricOpts.xAxis.data = iotStore.xAxisLabel
  electricOpts.series[0].data = iotStore.voltageData
  electricOpts.series[1].data = iotStore.electricData
  electricChart.setOption(electricOpts)

  humidityOpts.xAxis.data = iotStore.xAxisLabel
  humidityOpts.series.data = iotStore.humidityData
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