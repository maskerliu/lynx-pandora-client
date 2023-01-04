<template>

  <van-popup :show="show" @close="emits('update:show', false)" position="bottom" round>
    <van-grid column-num="3" style="margin: 15px;" :border="false" :gutter="10">
      <van-grid-item class="purchase-item" :class="selectedItem?._id == item._id ? 'active' : ''"
        v-for="item in purchaseItems" @click="selectedItem = item">
        <van-row>
          <van-icon class="iconfont icon-diamonds" size="1rem" color="#00a8ff" style="margin: auto 5px;" />
          <span style="font-size: 1.5rem"> {{ item.name }}</span>
        </van-row>
        <div style="font-size: 0.8rem; color: #bdc3c7">{{ item.discount }}</div>
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

    <van-button style="width: calc(100% - 30px); background-color: #0097e6; margin: 15px; color: white;"
      :text="$t('payment.purchase.pay') + `${selectedItem ? selectedItem.discount : ''}`" />
  </van-popup>

</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Payment } from '../../models';

const props = defineProps<{
  show: boolean
}>()

const emits = defineEmits(['update:show'])

const purchaseItems = ref<Array<Payment.PurchaseItem>>([])
const payChannels = ref<Array<Payment.PayChannel>>([])
const payChannel = ref('1')
const selectedItem = ref<Payment.PurchaseItem>(null)

onMounted(() => {
  mockPurchaseItems()
})

function mockPurchaseItems() {

  payChannels.value.push({ _id: '1', name: '微信支付', icon: 'icon-weixinzhifu', color: '#4cd137' })
  payChannels.value.push({ _id: '2', name: '支付宝', icon: 'icon-zhifubao', color: '#3498db' })

  purchaseItems.value.push({
    _id: 'd1111',
    name: '10',
    discount: '10'
  })

  purchaseItems.value.push({
    _id: 'd1112',
    name: '20',
    discount: '20'
  })

  purchaseItems.value.push({
    _id: 'd1113',
    name: '30',
    discount: '30'
  })

  purchaseItems.value.push({
    _id: 'd1114',
    name: '50',
    discount: '48'
  })

  purchaseItems.value.push({
    _id: 'd1115',
    name: '100',
    discount: '90'
  })

}
</script>
<style scoped>
.purchase-item {
  border: solid 2px #f39c1200;
  border-radius: 8px;
  padding: 5px;
}

.active {
  border: solid 2px #f39c12;
}
</style>
