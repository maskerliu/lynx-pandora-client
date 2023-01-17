<template>
  <span>
    <van-button round style="width: 35px; height: 35px; margin-left: 10px;" @click="showGiftPanel = !showGiftPanel">
      <template #icon>
        <van-icon class="iconfont icon-gift" size="24" color="#f39c12" />
      </template>
    </van-button>
    <van-popup v-model:show="showGiftPanel" position="bottom" round style="background: #34495e;">
      <van-row style="width: calc(100% - 30px); overflow: hidden; margin: 15px; font-size: 0.8rem;">
        <div style="margin: auto;">{{ $t('square.room.to') }}</div>
        <div class="seats-panel">
          <van-image v-for="seat in chatroomStore.curRoom?.seats.filter(it => it.userInfo != null)" fit="cover"
            radius="2rem" class="seat-item" :class="selectedSeats.includes(seat.userInfo.uid) ? 'active' : ''"
            :src="'//' + commonStore.appConfig?.staticServer + seat.userInfo.avatar"
            @click="onSeatClicked(seat.userInfo.uid)" />
        </div>
      </van-row>
      <van-tabs v-model:active="activeTab" shrink background="transparent" title-active-color="#ecf0f1"
        title-inactive-colo="#bdc3c7">
        <van-tab title="普通"></van-tab>
        <van-tab title="特权"></van-tab>
      </van-tabs>
      <van-swipe class="gift-swiper" lazy-render>
        <van-swipe-item v-for="i in Math.ceil(gifts.length / 8)">
          <van-grid :column-num="4" :border="false">
            <van-grid-item v-for="j in 8" class="gift-item"
              :class="selectedGift == ((i - 1) * 8 + j - 1) ? 'active' : ''"
              @click="onGiftSelected((i - 1) * 8 + j - 1)">
              <template #default style="background: transparent;">
                <div v-if="((i - 1) * 8 + j - 1) >= gifts.length" style="width: 100%; height: 0;"></div>
                <div v-else>
                  <van-image :src="`//${commonStore.appConfig?.staticServer}${gifts[(i - 1) * 8 + j - 1]?.snap}`"
                    fit="cover" style="width: 4rem; height: 4rem;" />
                  <div class="gift-item-info">
                    <div class="gift-item-name">
                      {{ gifts[(i - 1) * 8 + j - 1]?.title }}
                    </div>
                    <div class="gift-item-price">
                      {{ gifts[(i - 1) * 8 + j - 1]?.price }}
                    </div>
                  </div>
                </div>
              </template>
            </van-grid-item>
          </van-grid>
        </van-swipe-item>
        <template #indicator="{ active, total }">
          <div class="custom-indicator">{{ active + 1 }}/{{ total }}</div>
        </template>
      </van-swipe>

      <van-row justify="end" style="position: absolute; right: 0; bottom: 0; width: calc(100% - 30px); margin: 15px">
        <van-popover placement="top-end" v-model:show="showGiftCount" @select="onGiftCountSelect">
          <template #reference>
            <van-button plain size="small" type="primary" style="width: 50px;" :text="`${giftCount}`" />
          </template>
          <van-cell :title="i" style="width: 100px;" :value="i" v-for="i in 4" clickable
            @click="onGiftCountSelect(i)" />
        </van-popover>
        <van-button size="small" type="primary" :text="$t('square.room.reward')" @click="reward"
          style="margin:2px 0 0 -3px; border-top-left-radius: 0; border-bottom-left-radius: 0;" />
      </van-row>
    </van-popup>
  </span>
</template>
<script lang="ts" setup>
import { showToast } from 'vant';
import { onMounted, ref, watch } from 'vue';
import { Chatroom } from '../../../models';
import { useChatroomStore, useCommonStore } from '../../../store';

const commonStore = useCommonStore()
const chatroomStore = useChatroomStore()

const gifts = ref<Array<Chatroom.Gift>>([])
const activeTab = ref(0)
const showGiftPanel = ref(false)
const showGiftCount = ref(false)
const giftCount = ref(1)
const selectedSeats = ref<Array<string>>([])
const selectedGift = ref(-1)

onMounted(async () => {
  gifts.value = chatroomStore.gifts(Chatroom.GiftType.Normal)
})

watch(activeTab, async () => {
  selectedGift.value = -1
  if (activeTab.value == 1) {
    await chatroomStore.getVIPGifts()
    gifts.value = chatroomStore.gifts(Chatroom.GiftType.VIP)
  } else {
    gifts.value = chatroomStore.gifts(Chatroom.GiftType.Normal)
  }
})

watch(showGiftPanel, () => {
  if (!showGiftPanel) {
    giftCount.value = 1
    selectedGift.value = -1
    selectedSeats.value = []
  }
})

function onSeatClicked(uid: string) {
  let pos = selectedSeats.value.indexOf(uid)
  if (pos == -1) {
    selectedSeats.value.push(uid)
  } else {
    selectedSeats.value.splice(pos, 1)
  }
}

function onGiftSelected(idx: number) {
  selectedGift.value = idx
}

function onGiftCountSelect(count: number) {
  giftCount.value = count
  showGiftCount.value = false
}

async function reward() {
  let giftId = gifts.value[selectedGift.value]._id
  if (giftId != null && selectedSeats.value.length > 0 && giftCount.value > 0) {
    try {
      await chatroomStore.reward(giftId, giftCount.value, selectedSeats.value)
    } catch (err) {
      commonStore.showPurchase = true
    } finally {
      showGiftPanel.value = false
    }
  } else {
    showToast('请选择要打赏的麦位，挑选合适数量的礼物再打赏')
  }
}

</script>
<style scoped>
.seats-panel {
  width: calc(100% - 60px);
  height: 36px;
  overflow: auto hidden;
  white-space: nowrap;
  text-align: left;
}

.seat-item {
  width: 32px;
  height: 32px;
  border: solid 2px #fff0;
  border-radius: 16px;
  margin: 0 15px 0 0;
}

.gift-swiper {
  width: calc(100vw - 30px);
  margin: 5px 15px;
  padding-bottom: 30px;
}

.custom-indicator {
  width: 25px;
  border-radius: 5px;
  margin: 0 auto;
  padding: 2px 5px;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.1);
}

.gift-item {
  border: solid 2px #f39c1200;
  border-radius: 8px;
}

.gift-item-info {
  width: 100%;
  text-align: center;
  font-size: 0.8rem;
  color: #ecf0f1;
}

.gift-item-name {
  margin-top: -0.4rem;
}

.gift-item-price {
  font-size: 0.6rem;
  color: #e67e22;
  margin-top: -0.3rem;
}

.active {
  border: solid 2px #f39c12;
}
</style>