<template>
  <van-col span="6" class="seat-item">
    <div class="seat-box" @click="onSeatClick">
      <img v-show="showSoundWave" class="sound-wave" :src="SoundWave" />
      <van-image v-if="seatInfo.userInfo" class="seat-item-avatar" fit="cover" round radius="36"
        :src="'//' + commonStore.appConfig?.staticServer + seatInfo.userInfo.avatar" />
      <van-icon class="seat-item-icon iconfont icon-lock" v-else-if="seatInfo.isLocked" size="24" />
      <van-icon class="seat-item-icon iconfont icon-add" size="24" v-else />
      <img class="seat-item-frame" :src="`//${commonStore.appConfig.staticServer}${seatInfo.userInfo.seatFrame}`"
        v-if="seatInfo.userInfo?.seatFrame != null" />
      <span class="seat-item-mute iconfont icon-mute" v-if="(seatInfo && seatInfo.isMute)"></span>
    </div>
    <div class="seat-item-name">
      {{ seatInfo.userInfo ? seatInfo.userInfo.name : (seatInfo.seq == 0 ? '主持' : `${seatInfo.seq}号麦`) }}
    </div>
  </van-col>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import SoundWave from '../../../../asserts/sound_wave.png';
import { Chatroom } from '../../../../models';
import { useCommonStore } from '../../../../store';

const commonStore = useCommonStore()
const showSoundWave = ref(true)
const seatIsLock = ref(false)

const props = defineProps<{
  seatInfo: Chatroom.Seat
}>()

const seatFrame = ref(null)

const emits = defineEmits(['seatClick'])

onMounted(() => {
})


function onSeatClick() {
  emits('seatClick')
}

</script>
<style>
.seat-item {
  height: 61px;
  position: relative;
  color: white;
  text-align: center;
  display: inline-block;
  margin-top: 20px;
}

.seat-box {
  width: 40px;
  height: 40px;
  border: solid 2px #ecf0f1;
  border-radius: 40px;
  position: relative;
  margin: 0 auto;
}

.seat-item-avatar {
  /* position: absolute; */
  width: 38px;
  height: 38px;
  margin: 1px;
}

.seat-item-icon {
  position: absolute;
  width: 26px;
  height: 26px;
  inset: 0;
  margin: auto;
}

.seat-item-avatar:hover {
  cursor: pointer;
}

.sound-wave {
  position: absolute;
  width: 70px;
  height: 70px;
  top: -15px;
  left: -15px;
}

.seat-item-frame {
  position: absolute;
  width: 60px;
  height: 60px;
  top: -10px;
  left: -10px;
}

.seat-item-mute {
  width: 16px;
  height: 16px;
  position: absolute;
  right: 25px;
  top: 22px;
  color: white;
  font-size: 12px;
  background: #f56c6c;
  border: 1px solid white;
  border-radius: 1.2rem;
}

.seat-item-name {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 0.7rem;
  margin-top: 6px;
  text-align: center;
}

.seat-item-tag {
  margin-top: 5px;
}

.seat-identifier {
  height: 12px;
  position: relative;
  top: 78%;
}

.is-mute {
  position: absolute;
  right: 25px;
  bottom: 5px;
  z-index: 2;
}

.seat-item-charm-tag {
  position: absolute;
  left: 48px;
  top: -5px;
  font-size: 0.5rem;
  color: white;
  border-radius: 8px;
  padding: 2px 4px;
  background: #e74c3c;
  white-space: pre;
}

.menu-item {
  width: 100%;
  line-height: 36px;
  padding: 0 20px;
  font-size: 14px;
  cursor: pointer;
  box-sizing: border-box;
}

.menu-item:hover {
  background-color: #ecf5ff;
  color: #66b1ff;
}

.popover-menu {
  margin-top: 4px !important;
  padding: 0px !important;
}

.seat-crown {
  position: absolute;
  top: -12px;
  left: 14px;
  width: 26px;
}

.avatar-mask {
  background: rgba(0, 0, 0, 0.6);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #fff;
  position: absolute;
  top: 0;
  left: 25px;
  font-size: 10px;
  line-height: 40px;
  /* &.blinddateFemaleSeatSelected {
    background: rgba(255, 122, 227, 0.8);
    font-size: 10px;
  }
  &.blinddateMaleSeatSelected {
    background: rgba(35, 153, 255, 0.8);
    font-size: 10px;
  }
  &.blinddateSeatPublishable {
    background: rgba(0, 0, 0, 0.6);
    font-size: 14px;
  } */
}

.user-list-empty {
  color: #aaaaaa;
  text-align: center;
}

.user-list-container {
  max-height: 300px;
  overflow: scroll;
}

.user-item {
  border-bottom: 1px solid #eee;
  padding: 8px 4px;
  cursor: pointer;
}
</style>