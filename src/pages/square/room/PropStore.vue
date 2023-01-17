<template>
  <van-row style="width:100%; height: 100%;" justify="end">
    <van-sidebar v-model="activeGroup" style="position: absolute; top: 0; left: 0; width: 90px; height: 100%;">
      <van-sidebar-item :title="group.title" v-for="group in groups" />
    </van-sidebar>
    <van-col style="width: calc(100% - 90px); height: 100%; overflow-y: auto; padding-bottom: 75px; text-align: start;">
      <template v-if="activeGroup != groups.length - 1">
        <van-grid column-num="3" clickable :border="false" style="margin-top: 15px;" v-if="groups[activeGroup]">
          <van-grid-item class="prop" :class="activeProp == idx ? 'active' : ''" @click="activeProp = idx"
            v-for="(item, idx) of groups[activeGroup].props">
            <template #default style="background: transparent;">
              <van-image width="3rem" height="3rem" fit="contain"
                :src="`//${commonStore.appConfig?.staticServer + item.snap}`" />
              <div style="font-size: 0.9rem; color: #34495e; margin-top: 5px;">
                {{ item.name }}
              </div>
              <div style="font-size: 0.8rem; color: #f39c12; display: flex; margin-top: 5px;">
                <van-icon class="iconfont icon-diamonds" size="15" /> <span>{{ item.price }}</span>
              </div>
            </template>
          </van-grid-item>
        </van-grid>
        <div class="buy-button">
          <van-button block type="success" @click="buyProp"
            :text="`${$t('square.propStore.purchase')}${activeProp != -1 ? groups[activeGroup].props[activeProp].price : ''}`" />
        </div>
      </template>
      <template v-else>

        <template v-for="group in myProps">
          <div style="padding: 20px 0 0 15px; font-size: 0.8rem; font-weight: bold;">{{ group.title }}</div>
          <van-grid column-num="3" :border="false">
            <van-grid-item class="prop" v-for="(item, idx) of group.orders" @click="activeProp = idx">
              <template #default style="background: transparent;">
                <van-image width="3rem" height="3rem" fit="contain"
                  :src="`//${commonStore.appConfig?.staticServer + item.prop.snap}`" />
                <div style="font-size: 0.8rem; color: #34495e;">
                  {{ item.prop.name }}
                </div>
                <div class="van-ellipsis" style="font-size: 0.8rem; color: #bdc3c7;">
                  {{ $d(new Date(item.expired), 'middle') }}
                </div>
                <div style="font-size: 0.9rem; color: #f39c12; display: flex; margin-top: 5px;">
                  <van-button plain type="primary" size="small" @click="useProp(item)"
                    :text="$t(item.status == Chatroom.PropOrderStatus.On ? 'square.propStore.dressOff' : 'square.propStore.dressUp')" />
                </div>
              </template>
            </van-grid-item>
          </van-grid>
        </template>
      </template>
    </van-col>
  </van-row>
</template>
<script lang="ts" setup>
import { group } from 'console';
import { showToast } from 'vant';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Chatroom, ChatroomApi } from '../../../models';
import { useCommonStore } from '../../../store';

const commonStore = useCommonStore()
const i18n = useI18n()
const activeGroup = ref(0)
const activeProp = ref(-1)

const groups = ref<Array<Chatroom.PropGroup>>([])
const myProps = ref<Array<{ title: string, orders: Array<Chatroom.PropOrder> }>>([])

onMounted(async () => {
  commonStore.navbar.title = i18n.t('mine.propStore')
  groups.value = await ChatroomApi.propStore()

  groups.value.push({ title: '我的装扮', props: [] })
})

watch(activeGroup, async () => {
  activeProp.value = -1

  if (activeGroup.value == groups.value.length - 1) {
    myProps.value = await ChatroomApi.myProps()
    let dressupOrders: Array<Chatroom.PropOrder> = []
    myProps.value.forEach(group => {
      group.orders.forEach(it => {
        if (it.status == Chatroom.PropOrderStatus.On)
          dressupOrders.push(it)
      })
    })
    commonStore.updateMyProps(dressupOrders)
  }
})

async function buyProp() {
  try {
    let propId = groups.value[activeGroup.value].props[activeProp.value]._id
    await ChatroomApi.buyProp(propId, 1)
    showToast('购买成功')
  } catch (err) {
    showToast(err)
  }
}

async function useProp(order: Chatroom.PropOrder) {
  let status = order.status == Chatroom.PropOrderStatus.On ? Chatroom.PropOrderStatus.Off : Chatroom.PropOrderStatus.On
  let propInfo = await ChatroomApi.updatePropOrderStatus(order._id, order.propId, status, order.prop.type)
  commonStore.profile = Object.assign(commonStore.profile, propInfo)
  order.status = status

  let i = 0
  for (i = 0; i < myProps.value.length; ++i) {
    if (myProps.value[i].orders[0].prop.type == order.prop.type) break
  }

  myProps.value[i].orders.forEach(it => {
    if (it._id != order._id) it.status = Chatroom.PropOrderStatus.Off
  })
}

</script>
<style scoped>
.prop {
  margin-top: 10px;
  border: solid 2px transparent;
  border-radius: 5px;
}

.active {
  border: solid 2px #f39c12;
}

.buy-button {
  background-color: #f6f6f6;
  position: fixed;
  bottom: 0;
  right: 0;
  width: calc(100% - 120px);
  padding: 15px;
}
</style>