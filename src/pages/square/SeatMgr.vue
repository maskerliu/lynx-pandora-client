<template>
  <van-popup :show="show" @close="emits('update:show', false)" position="bottom" round style="height: 300px;">

    <template v-if="seatInfo.userInfo">
      <div class="seat-box" style="margin-top: 15px;">
        <van-image :src="seatInfo.userInfo.avatar" fit="cover" round radius="36" class="seat-item-avatar" />
        <span class="seat-item-mute iconfont icon-mute" v-if="(seatInfo && seatInfo.isMute)"></span>
      </div>
      <div class="seat-item-name">
        {{ seatInfo.userInfo.name }}
      </div>

      <div style="text-align: center; margin: 15px;">
        <van-button plain type="warning" size="small" text="抱下麦" />
      </div>
    </template>
    <template v-else>
      <div>上麦申请</div>
      <van-list style="width:100%; height: 300px;">
        <van-cell title="张三" v-for="i in 10" clickable>
          <template #value>
            <van-button plain type="primary" size="small" text="抱上麦" />
          </template>
        </van-cell>
      </van-list>
    </template>
  </van-popup>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { Channel } from '../../models';

defineProps<{
  show: boolean,
  seatInfo: Channel.Seat
}>()

const emits = defineEmits(['update:show'])

onMounted(() => {

})

</script>
<style scoped>

</style>