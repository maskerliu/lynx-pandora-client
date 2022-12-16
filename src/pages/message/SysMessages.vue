<template>
  <van-list style="height: 100%; overflow-y: auto;">
    <van-row
      style="width:calc(100% - 30px); max-height: 320px; background-color: white; border-radius: 8px; margin: 15px;">
      <van-image radius="8" src="https://pic3.zhimg.com/80/v2-d7597ec30712c6d34208e6b8159f3318_720w.jpg?source=1940ef5c"
        fit="cover" style="width: 100%; max-height: 260px;" />
      <div class="van-multi-ellipsis--l2" style="margin: 5px; font-size: 0.8rem; color: #2c3e50;">
        这是一个公告https://pic3.zhimg.com/80/v2-d7597ec30712c6d34208e6b8159f3318_720w.jpg?source=1940ef5chttps://pic3.zhimg.com/80/v2-d7597ec30712c6d34208e6b8159f3318_720w.jpg?source=1940ef5c
      </div>
    </van-row>

    <van-row
      style="width:calc(100% - 30px); max-height: 320px; background-color: white; border-radius: 8px; margin: 15px;"
      clickable>
      <van-image radius="8" src="https://pic3.zhimg.com/80/v2-d7597ec30712c6d34208e6b8159f3318_720w.jpg?source=1940ef5c"
        fit="cover" style="width: 100%; max-height: 260px;" />
      <div class="van-multi-ellipsis--l2" style="margin: 5px; font-size: 0.8rem; color: #2c3e50;">
        这是一个公告https://pic3.zhimg.com/80/v2-d7597ec30712c6d34208e6b8159f3318_720w.jpg?source=1940ef5chttps://pic3.zhimg.com/80/v2-d7597ec30712c6d34208e6b8159f3318_720w.jpg?source=1940ef5c
      </div>
    </van-row>

  </van-list>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '../../store';

const commonStore = useCommonStore()
const i18n = useI18n()

onMounted(() => {
  commonStore.navbar.title = i18n.t('message.sys.title')
})

</script>
<style scoped>

</style>