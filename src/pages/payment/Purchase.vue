<template>
  <van-popup :show="show" position="bottom" round @close="emits('update:show', false)">
    <van-grid column-num="3" style="margin: 15px; padding: 0;" :border="false" :gutter="10">
      <van-grid-item class="purchase-item" :class="selectedItem?._id == item._id ? 'purchase-item-active' : ''"
        style="padding: 10px 5px;" v-for="item in purchaseItems" @click="selectedItem = item">
        <van-row>
          <van-icon class="iconfont icon-diamonds" size="0.8rem" color="#00a8ff" style="margin: auto 2px;" />
          <span style="font-size: 1rem; font-weight: bold;"> {{ $n(item.diamonds, 'currency') }}</span>
        </van-row>
        <div class="purchase-item-info">
          <span class="purchase-item-price" v-if="item.price != item.discount">{{ item.price }}</span>
          {{ item.discount }}
        </div>
      </van-grid-item>
    </van-grid>

    <van-radio-group v-model="payChannel">
      <van-cell-group inset>
        <van-cell :title="channel.name" v-for="channel in payChannels" center clickable
          @click="payChannel = channel._id">
          <template #icon>
            <van-icon class="iconfont" :class="channel.icon" size="1.2rem" :color="channel.color"
              style="margin-right: 10px;" />
          </template>
          <template #right-icon>
            <van-radio :name="channel._id" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>

    <van-button class="pay-btn" @click="purchase"
      :text="$t('payment.pay') + `  ${selectedItem ? selectedItem.discount : ''}`" />
  </van-popup>

</template>
<script lang="ts" setup>
import { showNotify, showToast } from 'vant';
import { onMounted, ref, watch } from 'vue';
import { Payment } from '../../models';
import { PaymentApi } from '../../models/payment.api';
import { useCommonStore } from '../../store';

const props = defineProps<{
  show: boolean
}>()

const emits = defineEmits(['update:show'])

const commonStore = useCommonStore()
const purchaseItems = ref<Array<Payment.PurchaseItem>>([])
const payChannels = ref<Array<Payment.PayChannel>>([])
const payChannel = ref(null)
const selectedItem = ref<Payment.PurchaseItem>(null)

onMounted(() => {

})

watch(() => props.show, async () => {

  if (props.show) {
    let config = await PaymentApi.rechargeConfig()
    payChannels.value = config.channels
    purchaseItems.value = config.purchases
    payChannel.value = config.channels[0]._id
  }
})

async function purchase() {

  if (selectedItem.value == null) {
    showToast('请选择充值项')
    return
  }

  try {
    commonStore.wallet = await PaymentApi.recharge(selectedItem.value._id, payChannel.value)
    emits('update:show', false)
  } catch (err) {
    showNotify({ type: 'danger', message: err.toString(), duration: 500 })
  }
}
</script>
<style scoped>
.pay-btn {
  width: calc(100% - 30px);
  background-color: #0097e6;
  margin: 15px;
  color: white;
}
</style>
