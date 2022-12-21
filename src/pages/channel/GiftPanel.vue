<template>
  <span>
    <van-button round style="width: 35px; height: 35px; margin-left: 10px;" @click="showGiftPanel = !showGiftPanel">
      <template #icon>
        <van-icon class="iconfont icon-gift" size="24" />
      </template>
    </van-button>
    <van-popup v-model:show="showGiftPanel" position="bottom">
      <van-row style="width: calc(100% - 30px); overflow: hidden; margin: 15px;">
        <div style="font-size: 0.8rem; margin: auto;">麦序</div>
        <div style="width: calc(100% - 60px); height: 34px; overflow: auto hidden; white-space: nowrap;">
          <van-image v-for="i in 8" fit="cover" radius="2rem" class="seat-item" :class="selectedSeats.includes(i) ? 'active' : ''"
            @click="onSeatClicked(i)" />
        </div>
      </van-row>
      <van-swipe class="my-swipe" indicator-color="white" style="width: calc(100vw - 30px); margin: 0 15px;">
        <van-swipe-item v-for="i in Math.ceil(gifts.length / 8)">
          <van-grid :column-num="4" :border="false">
            <van-grid-item v-for="j in 8" style="padding: 0;" @click="onGiftSelected((i - 1) * 8 + j - 1)">
              <template #default>
                <div v-if="((i - 1) * 8 + j - 1) >= gifts.length" style="width:100%; height: 0;"></div>
                <div v-else class="gift-item" :class="selectedGift == ((i - 1) * 8 + j - 1) ? 'active' : ''">
                  <van-image :src="gifts[(i - 1) * 8 + j - 1]?.snap" fit="cover" style="width: 4rem; height: 4rem;" />
                  <div style="width: 100%; text-align: center;">
                    <div style="font-size: 0.7rem; color: #d35400">{{ gifts[(i - 1) * 8 + j - 1]?.title }}</div>
                    <div style="font-size: 0.6rem; color: #d35400">{{ gifts[(i - 1) * 8 + j - 1]?.priceDesc }}</div>
                  </div>
                </div>
              </template>
            </van-grid-item>
          </van-grid>
        </van-swipe-item>
      </van-swipe>

      <van-row justify="end" style="width: calc(100% - 30px); margin: 15px">
        <van-popover placement="top-end" v-model:show="showGiftCount" @select="onGiftCountSelect">
          <template #reference>
            <van-button plain size="small" type="primary" style="width: 50px;" :text="`${giftCount}`" />
          </template>
          <van-cell :title="i" style="width: 100px;" :value="i" v-for="i in 4" clickable
            @click="onGiftCountSelect(i)" />
        </van-popover>
        <van-button plain size="small" type="primary" text="赠送"
          style="margin:2px 0 0 -3px; border-top-left-radius: 0; border-bottom-left-radius: 0;" />
      </van-row>
    </van-popup>
  </span>
</template>
<script lang="ts" setup>
import { number } from '@intlify/core-base';
import { onMounted, ref } from 'vue'
import { ChatRoom } from '../../models';

const showGiftPanel = ref(false)
const showGiftCount = ref(false)
const seats = ref<Array<ChatRoom.Seat>>([])
const gifts = ref<Array<ChatRoom.Gift>>([])
const giftCount = ref(0)
const selectedSeats = ref<Array<number>>([])
const selectedGift = ref(-1)


const mockGift: Array<ChatRoom.Gift> = [
  {
    title: '结缘礼盒',
    snap: 'https://yppphoto.hellobixin.com/yppphoto/53c7c99af3994019a95674320bbb5203.png',
    priceDesc: '777777钻石'
  },
  {
    title: '刨冰机',
    snap: 'https://yppphoto.hellobixin.com/yppphoto/9c0191c085a943eeaca4f60359153e9f.png',
    priceDesc: '2999钻石'
  },
  {
    title: '挚爱礼盒',
    snap: 'https://yppphoto.hellobixin.com/yppphoto/bb71e52150554870ba7fc8f7fe186f99.png',
    priceDesc: '600000钻石'
  },
  {
    title: '樱之祈愿',
    snap: 'https://yppphoto.hellobixin.com/yppphoto/c4f2a2d8e1b2436ea2f1019759b1f28e.png',
    priceDesc: '233钻石'
  },
  {
    title: '春芽芽',
    snap: 'https://yppphoto.hellobixin.com/yppphoto/ebd33381004546c6a19e180efe7ef370.png',
    priceDesc: '2999钻石'
  },
  {
    title: '幸运饼干',
    snap: 'https://yppphoto.hellobixin.com/yppphoto/ef5b82dcaac249f2ab18281b6a722f59.png',
    priceDesc: '233钻石'
  },
  {
    title: '生日会',
    snap: 'https://yppphoto.hellobixin.com/yppphoto/4a88bc5fd1494fe19398b53f26e3751a.png',
    priceDesc: '233钻石'
  },
  {
    title: '童话恋舞曲',
    snap: 'https://yppphoto.hellobixin.com/yppphoto/b9877ddae2ff48e7a4dd29ac7cad2ac7.png',
    priceDesc: '600000钻石',
    effect: 'https://yvideo.eryufm.cn/video/2e19299275094c7f8114541ae6523ff9.mp4'
  },
  {
    title: '喜迎新春',
    snap: 'https://yppphoto.hellobixin.com/yppphoto/0cda36e4db0a46c7867ab95031cbdc59.png',
    priceDesc: '666钻石'
  },
  {
    title: '520礼盒',
    snap: 'https://yppphoto.hellobixin.com/yppphoto/8801fecef6804e22a17a15d3dc01fb1a.png',
    priceDesc: '727777钻石',
    effect: 'https://yvideo.eryufm.cn/video/30fdffa7a72747668c4592679614730c.mp4'
  },
  {
    title: '大熊玩偶',
    snap: 'https://yppphoto.hellobixin.com/yppphoto/b14a460535e84f748bed1b978a8642c3.png',
    priceDesc: '610钻石'
  },
  {
    title: '七夕礼盒',
    snap: 'https://yppphoto.hellobixin.com/yppphoto/b6054695eef04d2c945b8bdebdd071c9.png',
    priceDesc: '705200钻石',
    effect: 'https://yvideo.eryufm.cn/video/d2a2b7a7cce541cc9ad4f046d7eed850.mp4'
  },
  {
    title: '求签啦',
    snap: 'https://yppphoto.hellobixin.com/yppphoto/856f921c63284f61ac34c303f8eee65f.png',
    priceDesc: '999钻石'
  },
  {
    title: '超强助力',
    snap: 'https://yppphoto.hellobixin.com/yppphoto/efbbcac0998147419a70bb28fd9529e1.png',
    priceDesc: '98钻石'
  },
  {
    title: '时光礼赞',
    snap: 'https://yppphoto.hellobixin.com/yppphoto/faab4b82ba154bf48200946295e04249.png',
    priceDesc: '112000钻石'
  },
  {
    title: '求婚礼盒',
    snap: 'https://yppphoto.hellobixin.com/yppphoto/cf8b521afa3441b3aacb1bdd4afb2f1d.png',
    priceDesc: '727777钻石'
  },
  {
    title: '惊吓盒',
    snap: 'https://yppphoto.hellobixin.com/yppphoto/3b2579f9f5b14514b6098b3cd1e85837.png',
    priceDesc: '199钻石'
  },
  {
    title: '整蛊盒',
    snap: 'https://yppphoto.hellobixin.com/yppphoto/3379e4f225a147c991e9d6fc67f89d28.png',
    priceDesc: '9999钻石'
  },
  {
    title: '闺蜜礼盒',
    snap: 'https://yppphoto.hellobixin.com/yppphoto/3ec1e8497a6046189bc3415c70a9815e.png',
    priceDesc: '52000钻石',
    effect: 'https://yvideo.eryufm.cn/video/44e2040e8f8e4e8cb2b854e49384e6f5.mp4'
  },
]

onMounted(() => {
  gifts.value = mockGift
})

function onSeatClicked(idx: number) {
  let pos = selectedSeats.value.indexOf(idx)
  if (pos == -1) {
    selectedSeats.value.push(idx)
  } else {
    selectedSeats.value.splice(pos, 1)
  }
}

function onGiftSelected(idx: number) {
  selectedGift.value = idx
  console.log(gifts.value[idx].title)
}

function onGiftCountSelect(count: number) {
  giftCount.value = count
  showGiftCount.value = false
}
</script>
<style scoped>
.seat-item {
  width: 32px;
  height: 32px;
  border: solid 1px #fff0;
  border-radius: 32px;
  margin: 0 15px 0 0;
}

.gift-item {
  border: solid 1px #f39c1200;
  border-radius: 8px;
  padding: 5px;
}

.active {
  border: solid 1px #f39c12;
}
</style>