<template>
  <van-col class="bg-border top-panel" style="border: 0; margin-top: 0; padding-bottom: 15px;">

    <van-row justify="center" style="margin-bottom: 15px;">
      <seat :seat-info="chatroomStore.curRoom?.seats[0]"
        @seat-click="emits('seatClick', chatroomStore.curRoom?.seats[0])" />
    </van-row>
    <van-row justify="center">
      <seat v-for="i in 4" :seat-info="chatroomStore.curRoom?.seats[i]"
        @seat-click="emits('seatClick', chatroomStore.curRoom?.seats[i])" />
    </van-row>
  </van-col>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import { useChatroomStore } from '../../../store';
import Seat from './Seat.vue';

const emits = defineEmits(['seatClick'])


const chatroomStore = useChatroomStore()


onMounted(() => { })

</script>
<style scoped>
.top-panel {
  background: linear-gradient(#e66465, #9198e5);
}
</style>