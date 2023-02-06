<template>
  <van-col>
    <van-search />

    <van-list>
      <van-checkbox-group v-model="checked">
        <van-cell-group>
          <van-cell v-for="(item, index) in sessions" clickable center :key="item._id" title-class="van-ellipsis"
            @click="toggle(index)">
            <template #icon>
              <van-checkbox :name="item._id" :ref="el => checkboxRefs[index] = el" @click.stop />
            </template>

            <template #title>
              <van-row>
                <van-image radius="5" fit="cover" width="3rem" height="3rem" style="margin: 0 15px;"
                  :src="`//${commonStore.appConfig?.staticServer + item.thumb}`" />
                <div style="margin: auto 0;">{{ item.title }}</div>
              </van-row>
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </van-list>
  </van-col>

</template>
<script lang="ts" setup>
import { inject, onMounted, ref, watch } from 'vue';
import { IM } from '../../models';
import { useCommonStore, useIMStore } from '../../store';
import { NavBack } from '../components/misc';


const commonStore = useCommonStore()
const imStore = useIMStore()

const navBack = inject(NavBack)

const checked = ref([])
const checkboxRefs = ref([])
const sessions = ref<Array<IM.Session>>([])

onMounted(async () => {

  commonStore.navbar.title = '选择一个或多个聊天'



  commonStore.rightAction = async () => {
    navBack()
  }

  sessions.value = await imStore.sessions()
})

watch(checked, () => {
  commonStore.navbar.rightText = checked.value.length > 0 ? 'icon-forward' : null
})

function toggle(index) {
  checkboxRefs.value[index].toggle()
}

</script>
<style scoped>

</style>