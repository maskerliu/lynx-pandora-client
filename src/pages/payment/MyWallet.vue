<template>
  <van-col>
    <van-cell center size="large">
      <template #icon>
        <van-icon class="iconfont icon-diamonds" size="1.5rem" color="#00a8ff" />
      </template>
      <template #value>
        <van-row>
          <span class="wallet-item" style="color: #0097e6">
            {{ $n(commonStore.wallet ? commonStore.wallet.diamonds : 0, 'currency') }}
          </span>
          <div style="font-size: 0.8rem; margin: 1px 0 0 5px;"><span> 钻石</span></div>
        </van-row>
      </template>
      <template #right-icon>
        <van-button type="primary" size="small" style="width: 60px;" :text="$t('payment.wallet.recharge')"
          @click="commonStore.showPurchase = true" />
      </template>
    </van-cell>

    <van-cell is-link center size="large" to="/payment/purseDetail">
      <template #icon>
        <van-icon class="iconfont icon-purse" size="1.5rem" color="#fbc531" />
      </template>
      <template #value>
        <van-row>
          <span class="wallet-item" style="color: #e1b12c">
            {{ $n(commonStore.wallet ? commonStore.wallet.purse : 0, 'currency') }}
          </span>
          <div style="font-size: 0.8rem; margin: 1px 0 0 5px;"><span> 魅力值</span></div>
        </van-row>
      </template>
    </van-cell>
  </van-col>

</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '../../store';


const i18n = useI18n()
const commonStore = useCommonStore()

onMounted(async () => {
  commonStore.navbar.title = i18n.t('mine.myWallet')
  await commonStore.updateMyWallet()
})

</script>
<style>
.wallet-item {
  padding-left: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  font-style: italic;
  color: #e1b12c
}

.purchase-item {
  border: solid 2px #f39c1200;
  border-radius: 8px;
}

.purchase-item-active {
  border: solid 2px #f39c12;
}

.purchase-item-info {
  font-size: 0.8rem;
  margin-top: 5px;
  color: #bdc3c7;
}

.purchase-item-price {
  text-decoration: line-through;
}
</style>
