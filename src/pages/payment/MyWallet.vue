<template>
  <van-col>
    <van-cell center size="large">
      <template #icon>
        <van-icon class="iconfont icon-diamonds" size="1.5rem" color="#00a8ff" />
      </template>
      <template #value>
        <van-row>
          <span style="padding-left: 10px; font-size: 1.5rem; font-weight: bold; font-style: italic; color: #0097e6">
            {{ $n(21520188.08, 'currency') }}
          </span>
          <div style="font-size: 0.8rem; margin: 1px 0 0 5px;"><span> 钻石</span></div>
        </van-row>
      </template>
      <template #right-icon>
        <van-button type="primary" size="small" style="width: 60px;" :text="$t('payment.wallet.recharge')" @click="showPurchase = true" />
      </template>
    </van-cell>

    <van-cell is-link center size="large" to="/payment/incomeDetail">
      <template #icon>
        <van-icon class="iconfont icon-purse" size="1.5rem" color="#fbc531" />
      </template>
      <template #value>
        <van-row>
          <span style="padding-left: 10px; font-size: 1.5rem; font-weight: bold; font-style: italic; color: #e1b12c">118
          </span>
          <div style="font-size: 0.8rem; margin: 1px 0 0 5px;"><span> 魅力值</span></div>
        </van-row>
      </template>
    </van-cell>


    <purchase v-model:show="showPurchase" />
  </van-col>

</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCommonStore } from '../../store'
import Purchase from './Purchase.vue'

const i18n = useI18n()
const commonStore = useCommonStore()

const showPurchase = ref(false)

onMounted(() => {

  commonStore.navbar.title = i18n.t('mine.myWallet')

})
</script>
<style scoped>

</style>
