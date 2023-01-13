<template>
  <van-col>
    <van-row justify="center" style="padding: 15px;">
      <span style="padding-left: 10px; font-size: 1.5rem; font-weight: bold; font-style: italic; color: #f39c12">
        {{ $n(commonStore.wallet ? commonStore.wallet.purse : 0, 'currency') }}
      </span>
      <div style="font-size: 0.8rem; margin: auto 5px; color: #bdc3c7"><span>魅力值</span></div>
    </van-row>

    <van-list style="height: calc(100% - 134px); overflow-y: auto;">
      <van-cell :label="$d(new Date(record.timestamp), 'long')" :title-style="{ color: '#34495e' }"
        v-for="record in records">

        <template #title>
          <van-icon class="iconfont icon-charm" size="16" color="#ff7979" />
          <span style="margin-left: 10px;">{{ (record.purse > 0 ? '+' : '-') + $n(record.purse, 'currency') }}</span>
        </template>
      </van-cell>
    </van-list>

    <van-button type="primary" @click="showExchange = true" :text="$t('payment.exchange')"
      style="position:absolute; bottom: 0; width: calc(100% - 30px); margin: 15px; color: white;" />

    <exchange v-model:show="showExchange" />

  </van-col>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Payment } from '../../models'
import { PaymentApi } from '../../models/payment.api'
import { useCommonStore } from '../../store'
import Exchange from './Exchange.vue'

const i18n = useI18n()
const commonStore = useCommonStore()
const records = ref<Array<Payment.PurseRecord>>([])
const showExchange = ref(false)

let page = 0

onMounted(async () => {
  commonStore.navbar.title = i18n.t('payment.purseDetail')

  let result = await PaymentApi.purseRecords(page)
  records.value.push(...result)
})
</script>
<style scoped>
.t {
  font-style: italic;
}
</style>