<template>
  <div class="feed-item" @click="gotoMoment">
    <van-row style="padding: 5px;">
      <van-image :src="`//${commonStore.appConfig?.staticServer}${moment.avatar}`" width="2rem" height="2rem" round
        radius="1rem" />
      <van-col class="item-info">
        <div class="item-title">
          <span> {{ moment.name }} - </span>
          <span style="color: #bdc3c7; font-size: 0.7rem;">{{ moment.timestamp ? $d(new Date(moment.timestamp), 'short') : '' }}</span>
        </div>
        <div class="item-desc van-multi-ellipsis--l2">
          {{ moment.desc ? moment.desc : '' }}
        </div>
      </van-col>
    </van-row>
    <template v-if="moment.images?.length > 0">
      <img class="item-cover" fit="cover" @load="calcImageHeight" @error="calcImageHeight"
        :src="`//${commonStore.appConfig?.staticServer}${moment.images[0]}`" />
    </template>
  </div>
</template>
<script lang="ts" setup>
import { inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Timeline } from '../../models'
import { useCommonStore, useTimelineStore } from '../../store'
import { CalcSquareFeedHeight } from '../components/misc'

const props = defineProps<{
  moment: Timeline.Moment
}>()

const calcImageHeight = inject(CalcSquareFeedHeight)

const router = useRouter()
const commonStore = useCommonStore()
const timelineStore = useTimelineStore()

onMounted(() => {

})

function gotoMoment() {
  timelineStore.curMoment = props.moment
  router.push({ name: 'Moment', params: { mid: props.moment._id } })
}

</script>
<style scoped>
.item-cover {
  background-color: #e7e7e7;
  border: 0;
  border-radius: 8px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.item-info {
  flex: 1;
  font-size: 1rem;
  color: #2c3e50;
  padding: 0 5px;
}

.item-title {
  font-size: 0.8rem;
  color: #34495e;
  font-weight: bold;
}

.item-desc {
  margin-top: 5px;
  font-size: 1rem;
}
</style>