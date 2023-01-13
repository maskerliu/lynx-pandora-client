<template>
  <van-popup :show="show" position="bottom" round @close="emits('update:show', false)">
    <van-grid column-num="3" style="padding: 5px; margin: 15px 0;" :border="false" :gutter="10">
      <van-grid-item class="purchase-item" :class="selectedItem?._id == item._id ? 'purchase-item-active' : ''"
        style="padding: 10px 5px;" v-for="item in purchaseItems" @click="selectedItem = item">
        <van-row>
          <van-icon class="iconfont icon-diamonds" size="0.8rem" color="#00a8ff" style="margin: auto 2px;" />
          <span style="font-size: 1rem; font-weight: bold;"> {{ $n(item.diamonds, 'currency') }}</span>
        </van-row>
        <div class="purchase-item-info">
          <span class="purchase-item-price" v-if="item.discount != item.price"> {{ item.price }}</span>
          {{ item.discount }}
        </div>
      </van-grid-item>
    </van-grid>

    <van-button class="exchange-btn" type="success" @click="exchange"
      :text="$t('payment.exchange') + `  ${selectedItem ? selectedItem.discount : ''}`" />
  </van-popup>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Payment } from '../../models';
import { PaymentApi } from '../../models/payment.api';
import { useCommonStore } from '../../store';

defineProps<{
  show: boolean
}>()

const emits = defineEmits(['update:show'])

const commonStore = useCommonStore()
const purchaseItems = ref<Array<Payment.PurchaseItem>>([])
const selectedItem = ref<Payment.PurchaseItem>()

onMounted(async () => {
  let { purchases } = await PaymentApi.exchangeConfig()
  purchaseItems.value = purchases
})

async function exchange() {
  commonStore.wallet = await PaymentApi.exchange(selectedItem.value._id)
  emits('update:show', false)
}

</script>
<style scoped>
.exchange-btn {
  width: calc(100% - 30px);
  margin: 15px;
}
</style>