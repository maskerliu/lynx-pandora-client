<template>

  <van-col style="height: 100%; overflow-y: auto;">
    <div style="width: 100%; height: 50px; background: white; border-radius: 15px 15px 0 0; margin-top: 150px;">
    </div>

    <div class="bg-border vip-card" :class="selectedItem?.type == VIP.VIPType.Normal ? 'normal' : 'svip'">
      <div style="font-size: 1.6rem; font-style: italic;  color: #67725c; margin: 20px; ">
        {{ selectedItem? selectedItem.name: '' }}
      </div>
      <div class="vip-card-expired">到期时间：{{ $d(expired, 'day') }}</div>
    </div>

    <div style="background: white;">
      <van-grid column-num="2" style="margin: 0 15px; padding: 15px 0; z-index: 1;">
        <van-grid-item v-for="(item, idx) in vipItems" @click="selectedItem = item">
          <template #default>
            <div class="vip-item-title" :style="{
              borderRadius: borderRaidus(idx),
              background: selectedItem == item ? '#ffeca2' : '#ecf0f1'
            }">
              {{ item.name }}
            </div>
            <van-row class="vip-item-discount">
              <van-icon class="iconfont icon-diamonds" size="15" color="#00a8ff" style="margin: auto 5px;" />
              <div :style="{ color: selectedItem == item ? '#e74c3c' : '#95a5a6' }">
                {{ $n(item.discount, 'currency') }}
              </div>
            </van-row>
            <div class="vip-item-price" v-if="item.price != item.discount">
              {{ $n(item.price, 'currency') }}
            </div>
            <div style="padding-bottom: 25px;"></div>
          </template>
        </van-grid-item>
      </van-grid>

      <van-col style="text-align: center; width: calc(100% - 30px); margin: 0 15px; padding: 15px 0;">
        <van-button round block type="primary" style="margin: 15px 0;" @click="buy"
          :text="`购买会员 ${selectedItem ? selectedItem.name : ''}`" />
        <van-checkbox class="animate__animated agreement" ref="agreement" v-model="checked"
          v-bind:class="doShake ? 'animate__headShake' : null">
          同意
          <a @click="gotoAgreementPage('https://bohr.bixin.cn/pandora/1560', $t('settings.about.privacySummary'))">
            《会员服务协议》
          </a>
          及
          <a @click="gotoAgreementPage('https://bohr.bixin.cn/pandora/1560', $t('settings.about.privacySummary'))">
            《隐私协议》
          </a>
        </van-checkbox>
      </van-col>
    </div>
    <van-col style="font-size: 0.8rem; color: #34495e; margin: 15px;">
      <h4>会员特权</h4>
      <li>全面展示个人信息</li>
      <li>开启频道会员专属表情包</li>
      <li>开启频道会员专属礼物</li>
      <li>专属客服</li>
    </van-col>
  </van-col>

</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { VIP, VIPApi } from '../../models'
import { useCommonStore } from '../../store'

const router = useRouter()
const commonStore = useCommonStore()

const vipItems = ref<Array<VIP.VIPItem>>([])
const selectedItem = ref<VIP.VIPItem>(null)
const agreement = ref()
const checked = ref(false)
const doShake = ref(false)
const expired = ref(0)

onMounted(async () => {
  commonStore.navbar.title = '会员等级'
  agreement.value.$el.addEventListener('animationend', () => { doShake.value = false })
  vipItems.value = await VIPApi.config()
  selectedItem.value = vipItems.value[0]
})

watch(selectedItem, () => {
  expired.value = new Date().getTime() + selectedItem.value.expired * 24 * 60 * 60 * 1000
})

async function buy() {
  if (!checked.value) {
    doShake.value = true
    return
  }

  try {
    let order = await VIPApi.buy(selectedItem.value._id)
    commonStore.updateVIP(order.type)
  } catch (err) {

  }
}

function gotoAgreementPage(url: string, title: string) {
  router.push({ name: `PrivacyAgreement`, hash: title, params: { url } })
}

function borderRaidus(idx: number) {
  if (idx == 0) return '15px 0 0 0'
  if (idx == 1) return '0 15px 0 0'

  return '0'
}

</script>
<style scoped>
a {
  color: #2980b9;
}

.vip-card {
  position: absolute;
  width: calc(100% - 30px);
  height: 160px;
  top: 0;
  left: 0;
  border: 0;
  margin-top: 0;
  padding-bottom: 15px;
  margin: 15px;
}

.vip-card-expired {
  font-size: 0.9rem;
  color: #b3841d;
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.normal {
  background: linear-gradient(95deg, #bdc3c7, #f0f0f1, #ecf0f1);
}

.svip {
  background: linear-gradient(95deg, #c0910e, #f0c10b, #ffbc13);
}

.agreement {
  width: 320px;
  font-size: 0.9rem;
  margin: 0 auto;
}

.vip-item-title {
  width: 100%;
  text-align: center;
  font-size: 1rem;
  color: #b3841d;
  padding: 15px 0;
}

.vip-item-discount {
  padding: 25px 0 0 0;
  font-size: 1.6rem;
  color: #95a5a6
}

.vip-item-price {
  color: #bdc3c7;
  text-decoration: line-through;
}
</style>