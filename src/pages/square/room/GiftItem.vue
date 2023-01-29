<template>
  <div>
    <van-image fit="cover" style="width: 4rem; height: 4rem;"
      :src="`//${commonStore.appConfig?.staticServer + gift?.snap}`" />
    <div class="gift-info">
      <div class="gift-name">
        {{ gift?.title }}
      </div>
      <div class="gift-price">
        {{ gift?.price }}
      </div>
    </div>

    <div class="gift-locked"
      v-if="gift.type == Chatroom.GiftType.VIP && commonStore.profile.vipType != User.VIPType.SVIP">
      <van-icon class="iconfont icon-lock" size="1.5rem"
        style="margin: auto 0; font-weight: bold; color: white; margin-top: 25px;" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Chatroom, User } from '../../../models';
import { useCommonStore } from '../../../store';

defineProps<{
  gift: Chatroom.Gift
}>()

const commonStore = useCommonStore()


</script>
<style scoped>
.gift-info {
  width: 100%;
  text-align: center;
  font-size: 0.8rem;
  color: #ecf0f1;
}

.gift-name {
  margin-top: -0.4rem;
}

.gift-price {
  font-size: 0.6rem;
  color: #e67e22;
  margin-top: -0.3rem;
}

.gift-locked {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  text-align: center;
  background: #00000055;
}
</style>