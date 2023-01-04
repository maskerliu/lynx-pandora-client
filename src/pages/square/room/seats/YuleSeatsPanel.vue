<template>
  <van-row class="bg-border top-panel"
    style="border: 0; background-color: transparent; margin-top: 0; padding: 15px 0;">
    <seat v-for="item in chatroomStore.curRoom?.seats" :seat-info="item" @seat-click="emits('seatClick', item)" />
  </van-row>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useChatroomStore } from '../../../../store';
import Seat from './Seat.vue';

const emits = defineEmits(['seatClick'])


const chatroomStore = useChatroomStore()

onMounted(() => { })

</script>
<style scoped>
.top-panel {
  background: linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c);
}
</style>