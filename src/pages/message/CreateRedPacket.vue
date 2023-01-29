<template>
  <van-col style="width: 100%;">

    <van-cell-group inset v-if="sessionType == IM.SessionType.GROUP">
      <template #title>
        <div @click="showTypesPanel = true">
          {{ redPakcetType?.title }}
          <van-icon name="arrow-down" />
        </div>
      </template>
      <van-field :label="$t('message.redpacket.count')" :placeholder="$t('message.redpacket.countPlaceholder')"
        type="number" v-model="count" readonly clickable input-align="right" @touchstart.stop="onCount"
        @clickstart.stop="onCount">
        <template #left-icon>
          <van-icon class="iconfont icon-red-packet" size="1rem" color="#e74c3c" />
        </template>
      </van-field>
    </van-cell-group>

    <van-cell-group title=" " inset>
      <template #title v-if="sessionType != IM.SessionType.GROUP">
        <div @click="showTypesPanel = true">
          {{ redPakcetType?.title }}
          <van-icon name="arrow-down" />
        </div>
      </template>
      <van-field
        :label="$t('message.redpacket.' + (redPakcetType?.type == IM.RedPacketType.Random ? 'totalAmount' : 'eachAmount'))"
        v-model="amount" input-align="right" :placeholder="$t('message.redpacket.amountPlaceholder')" readonly clickable
        @touchstart.stop="onAmount" @clickstart.stop="onAmount">
        <template #left-icon>
          <van-icon class="iconfont icon-ping" size="1rem" color="#f39c12" />
        </template>
      </van-field>
    </van-cell-group>

    <van-cell-group title=" " inset>
      <van-field type="textarea" v-model="note" :placeholder="$t('message.redpacket.notePlaceholder')" />
    </van-cell-group>

    <van-row style="display: flex; font-size: 2.5rem; margin-top: 30px;" justify="center">
      <div style="font-size: 1.5rem; margin: auto 0;">
        <van-icon class="iconfont icon-diamonds" color="#3498db" style="margin-right: 5px;" />
      </div>
      {{ totalAmount }}
    </van-row>

    <div style="text-align: center;">
      <van-button type="danger" style="width: 150px; margin: 25px auto;" :text="$t('message.redpacket.create')"
        @click="create" />
    </div>

    <van-number-keyboard :show="showNumberKeyboard" v-model="input" theme="custom" extra-key="."
      @blur="showNumberKeyboard = false; curInput = 0;" />

    <van-popup v-model:show="showTypesPanel" position="bottom">
      <van-cell :title="item.title" :title-style="{ textAlign: 'center' }" clickable
        v-for="(item, idx) of RedPacketTypes" @click="onSelectType(idx)"></van-cell>
    </van-popup>
  </van-col>
</template>
<script lang="ts" setup>
import { showToast } from 'vant'
import { computed, inject, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { IM, IMApi } from '../../models'
import { useCommonStore, useIMStore } from '../../store'
import { NavBack } from '../components/misc'

const navBack = inject(NavBack)

const i18n = useI18n()
const route = useRoute()
const commonStore = useCommonStore()
const imStore = useIMStore()


type PacketType = { type: IM.RedPacketType, title: string }

const redPakcetType = ref<PacketType>(null)
const amount = ref<number>(null)
const count = ref<number>(null)
const note = ref<string>(null)

const showTypesPanel = ref(false)
const showNumberKeyboard = ref(false)
const input = ref(null)
let sid: string = null
let sessionType: IM.SessionType = null
let curInput = 0

const RedPacketTypes: PacketType[] = [
  { type: IM.RedPacketType.Quota, title: i18n.t('message.redpacket.qutoa') },
  { type: IM.RedPacketType.Random, title: i18n.t('message.redpacket.random') }
]

onMounted(async () => {
  sid = route.params['sid'] as string
  sessionType = (await imStore.session(sid)).type
  if (sessionType == IM.SessionType.P2P) { count.value = 1 }
  redPakcetType.value = RedPacketTypes[0]
})

const totalAmount = computed({
  get() {
    let total = 0
    if (redPakcetType.value?.type == IM.RedPacketType.Random) {
      total = !isNaN(amount.value) && amount.value > 0 ? amount.value : 0
    } else {
      total = !isNaN(amount.value) && amount.value > 0 && !isNaN(count.value) && count.value > 0 ? amount.value * count.value : 0
    }
    return i18n.n(total, 'currency')
  },
  set() {

  }
})

function onAmount() {
  input.value = amount.value
  curInput = 1
  showNumberKeyboard.value = true
}

function onCount() {
  input.value = count.value
  curInput = 2
  showNumberKeyboard.value = true
}

function onSelectType(idx: number) {
  redPakcetType.value = RedPacketTypes[idx]
  showTypesPanel.value = false
}

async function create() {
  let order: IM.RedPacketOrder = {
    sid,
    uid: commonStore.profile.uid,
    name: commonStore.profile.name,
    avatar: commonStore.profile.avatar,
    amount: amount.value,
    count: count.value as number,
    note: note.value ? note.value : i18n.t('message.redpacket.notePlaceholder'),
    type: redPakcetType.value.type
  }
  if (isNaN(amount.value) || isNaN(count.value) || amount.value == 0 || count.value == 0) {
    showToast('请输入合适的金额和红包个数')
    return
  }

  await IMApi.createRedPacket(order)

  navBack()
}

watch(input, () => {
  if (curInput == 1) {
    amount.value = input.value
  } else if (curInput == 2) {
    count.value = input.value
  }
})

</script>
<style scoped>

</style>