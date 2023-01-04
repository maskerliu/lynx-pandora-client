<template>

  <van-col class="bg-border top-panel" style="border: 0; margin-top: 0; padding-bottom: 15px;">

    <van-row justify="center" style="margin-bottom: 15px;">
      <seat :seat-info="chatroomStore.curRoom?.seats[0]"
        @seat-click="emits('seatClick', chatroomStore.curRoom?.seats[0])" />
    </van-row>
    <van-row justify="center" :gutter="80">
      <seat :seat-info="chatroomStore.curRoom?.seats[1]"
        @seat-click="emits('seatClick', chatroomStore.curRoom?.seats[1])" />
      <seat :seat-info="chatroomStore.curRoom?.seats[2]"
        @seat-click="emits('seatClick', chatroomStore.curRoom?.seats[2])" />
    </van-row>
  </van-col>

</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useChatroomStore } from '../../../../store';
import Seat from './Seat.vue';

const emits = defineEmits(['seatClick'])


const chatroomStore = useChatroomStore()
const showSeatPanel = ref('1')

onMounted(() => { })

</script>
<style scoped>
.top-panel {
  background: linear-gradient(85deg, #0057fb88, #22937388, #92ff2a88);
}
</style>