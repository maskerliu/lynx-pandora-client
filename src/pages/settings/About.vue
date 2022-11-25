<template>
  <van-col>

    <van-cell-group>
      <div style="text-align: center;">
        <van-icon class="iconfont icon-iot" size="40" color="green" style="margin: 20px auto;" />
      </div>
      <van-cell title="版本" value="1.0.1" is-link />
    </van-cell-group>

    <div class="footer">
      <p><a>《软件许可及服务协议》</a></p>
      <p><a>《隐私保护指引摘要》</a> <a>《隐私保护指引》</a></p>
      <div style="color: grey; font-size: 0.6rem;">
        <p>客服电话：4600 8888</p>
        <p>Copyright @ 2021-2022 LynxChina. All Rights Reserved.</p>
      </div>
    </div>
  </van-col>
</template>
<script lang="ts" setup>

import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '../../store';

const i18n = useI18n()
const commonStore = useCommonStore()

onMounted(() => {
  commonStore.navbar.title = i18n.t('settings.sys.about')
})

</script>
<style scoped>
.footer {
  width: 100%;
  text-align: center;
  font-size: 0.7rem;
  position: absolute;
  bottom: 0;
  margin: 15px auto;
}
</style>