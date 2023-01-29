<template>
  <van-popup :show="show" @close="emits('update:show', false)" style="background:transparent; overflow: hidden;">
    <div ref="packetContainer" class="bg-border red-packet">

      <div class="red-packet-deatil">
        <div style="font-size: 2rem; color: #d29c04; height: 100px;">
          <van-row style=" padding: 30px;" justify="center">
            <van-icon class="iconfont icon-diamonds" color="#3498db" size="1rem" style="margin: auto 5px;" />
            <div>{{ myIdx > -1 ? $n(redpackets[myIdx].amount, 'currency') : '0.00' }}</div>
          </van-row>
        </div>
        <van-list style="height: calc(100% - 100px); overflow-y: auto;" v-if="order.count > 1">
          <van-cell v-for="item in redpackets" :title="item.name" :value="`¥${item.amount}`" center
            :label="$d(item.updateTime, 'long')" :title-style="{ textAlign: 'left' }">
            <template #icon>
              <van-image width="2.5rem" height="2.5rem" round radius="5px" fit="cover" style="margin-right: 10px;"
                :src="`//${commonStore.appConfig?.staticServer + item.avatar}`" />
            </template>
          </van-cell>
        </van-list>
      </div>

      <div ref="coverBottom" class="cover-bottom" v-if="redpackets.length < order.count && myIdx == -1"></div>

      <div ref="coverTop" class="cover-top" v-if="redpackets.length < order.count && myIdx == -1">
        <div style="position: relative; padding: 25px 0;">
          <van-image width="2.5rem" height="2.5rem" round radius="8px" fit="cover" style="display: inline-block;"
            :src="order.avatar ? `//${commonStore.appConfig?.staticServer + order.avatar}` : ''" />
          <div class="van-ellipsis" style="display: inline-block;max-width: 150px; margin: 5px;">{{ order.name }}</div>
        </div>
        <div style="font-size: 1.2rem; color: #f39c12; ">
          {{ order.note }}
        </div>
      </div>
      <van-button ref="btnOpen" class="open-button" round text="开" @click="openRedPacket"
        v-if="redpackets.length < order.count && myIdx == -1" />
    </div>
  </van-popup>
</template>
<script lang="ts" setup>
import { showToast } from 'vant';
import { onMounted, ref, watch } from 'vue';
import { BizFail, IM, IMApi } from '../../models';
import { useCommonStore } from '../../store';

const props = defineProps<{
  show: boolean
  order: IM.RedPacketOrder
}>()

const emits = defineEmits(['update:show'])

const commonStore = useCommonStore()

const redpackets = ref<Array<IM.RedPacket>>([])
const myIdx = ref(-1)
const packetContainer = ref<HTMLElement>()
const coverTop = ref<HTMLElement>()
const coverBottom = ref<HTMLElement>()
const btnOpen = ref()

onMounted(() => {

})

watch(() => props.show, async () => {
  if (props.show) {
    redpackets.value = await IMApi.claimedRedPackets(props.order?._id)
    myIdx.value = redpackets.value.findIndex(it => { return it.uid == commonStore.profile.uid })
  }
})


async function openRedPacket() {
  btnOpen.value.$el.classList.add('anim-rotate')
  try {
    redpackets.value = await IMApi.claimRedPacket(props.order._id)
    myIdx.value = redpackets.value.findIndex(it => { return it.uid == commonStore.profile.uid })
  } catch (err) {
    if (typeof err == 'string') {
      showToast(err)
    } else {
      let fail = err as BizFail
      showToast(fail.msg)
    }
  } finally {
    // btnOpen.value.$el.classList.remove('anim-rotate')
    // btnOpen.value.$el.style.display = 'none'
    coverTop.value.style.top = '-210px'
    coverTop.value.style.transition = `all 1.2s ease-in-out`
    coverBottom.value.style.top = `${packetContainer.value.clientHeight + 5}px`
    coverBottom.value.style.transition = `all 0.8s ease-in-out`
  }
}

</script>
<style scoped>
.red-packet {
  width: 80vw;
  height: 60vh;
  overflow: hidden;
  background: white;
  border: 0;
  text-align: center;
  margin: 0;
  border-radius: 12px;
}

.cover-top {
  width: 140%;
  height: 200px;
  background: #e74c3c;
  color: white;
  position: absolute;
  top: 0;
  left: -20%;
  border-radius: 8px 8px 70% 70%;
  box-shadow: 0 12px 8px -12px #000;
}

.cover-bottom {
  width: 100%;
  height: calc(100% - 140px);
  position: absolute;
  top: 140px;
  background: linear-gradient(180deg, #e2c472, #d29c04);
  border-radius: 0 0 12px 12px;
}

.red-packet-deatil {
  width: 100%;
  height: 100%;
  border-radius: 0 0 12px 12px;
  background: white;
}

.open-button {
  position: absolute;
  top: 170px;
  width: 3.5rem;
  height: 3.5rem;
  font-size: 1.2rem;
  color: white;
  background: #ebbe43;
  border-radius: 3.5rem;
  border: 5px solid #d29c04;
  margin-left: -30px;
  transform-style: preserve-3d;
}

.anim-rotate {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotateY(0deg);
  }

  100% {
    transform: rotateY(360deg);
  }
}
</style>