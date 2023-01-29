<template>
  <div class="bg-border red-packet-msg" :class="message?.read ? 'active' : ''" @click="show = true" wrap="false">
    <van-row class="van-hairline--bottom" style="padding: 5px 0 15px;">
      <van-icon class="iconfont icon-red-packet" size="1.2rem" color="#f39c12" style="padding: 2px;" />
      <div class="van-ellipsis" style="width: calc(100% - 40px); margin-left: 5px; font-size: 1rem;">
        {{ redpacketOrder?.note }}
      </div>
    </van-row>
    <div style="margin: 10px 0 0 2px; font-size: 0.8rem;">
      {{ redpacketOrder?.name }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { IM } from '../../models'

const props = defineProps<{
  message: IM.Message
}>()

const show = ref(false)

const redpacketOrder = props.message?.content as IM.RedPacketOrder

onMounted(() => {

})

</script>
<style scoped>
.red-packet-msg {
  width: 240px;
  background: linear-gradient(94deg, #e74c3c, #d35400, #d35400);
  color: white;
  padding: 10px;
  border: 0;
}

.active {
  background: linear-gradient(94deg, #f39c12ad, #e67e22ad, #d35400ad);
}
</style>