<template>
  <div id="map_container" style="width: 100%; height: 100%;"></div>
</template>

<script lang="ts" setup>
import { load } from '@amap/amap-jsapi-loader';
import { onMounted, onUnmounted, shallowRef, watch } from 'vue';

const map = shallowRef(null)

const props = defineProps<{
  lat: Number,
  lng: Number,
  address: String,
}>()

const emits = defineEmits(['update:lat', 'update:lng', 'update:address'])

onMounted(async () => {
  await initMap()
})

onUnmounted(() => {
  map.value.destroy()
})

watch(() => props.address, () => {
  let center = new window.AMap.LngLat(props.lng, props.lat)
  map.value.setCenter(center)
})

async function initMap() {
  if (window.AMap == null) {
    await load({
      "key": "fa8ed986df0438acb931c57ed3180dcc",
      "version": "2.0",
      "plugins": ['AMap.Scale', 'AMap.Marker', 'AMap.Geocoder', 'AMap.ToolBar'],
      "AMapUI": {
        "version": '1.1',
        "plugins": ['misc/PositionPicker'],
      },
    })
  }


  map.value = new window.AMap.Map("map_container", { viewMode: "2D", zoom: 18, })

  let center = new window.AMap.LngLat(props.lng, props.lat)
  map.value.setCenter(center)

  map.value.addControl(new window.AMap.ToolBar())

  window.AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker: any) => {
    let positionPicker = new PositionPicker({ mode: 'dragMap', map: map.value })

    positionPicker.on('success', (location: any) => {
      emits('update:address', location.address)
      emits('update:lat', location.position.lat)
      emits('update:lng', location.position.lng)
    })
    positionPicker.on('fail', (result: any) => {
      console.log(result)
    })
    positionPicker.start(center)
  })

}
</script>

<style>

</style>