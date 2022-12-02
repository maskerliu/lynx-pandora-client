<template>
  <van-col>
    <van-cell-group>
      <div style="text-align: center;">
        <van-icon class="iconfont icon-iot" size="50" color="green" style="margin: 20px auto;" />
      </div>
      <van-cell title="版本" value="1.0.1" is-link />
    </van-cell-group>

    <div class="footer">
      <p><a @click="gotoAgreementPage('https://bohr.bixin.cn/pandora/1560', $t('settings.about.privacy'))">
          {{ $t('settings.about.privacy') }}
        </a>
      </p>
      <p>
        <a @click="gotoAgreementPage('https://bohr.bixin.cn/pandora/1562', $t('settings.about.sdks'))">
          {{ $t('settings.about.sdks') }}
        </a> &nbsp;
        <a @click="gotoAgreementPage('https://bohr.bixin.cn/pandora/1560', $t('settings.about.privacySummary'))">
          {{ $t('settings.about.privacySummary') }}
        </a>
      </p>
      <div style="color: grey; font-size: 0.6rem;">
        <p>{{ $t('settings.about.customerService') }}：4600 8888</p>
        <p>Copyright @ 2021-2022 LynxChina. All Rights Reserved.</p>
      </div>
    </div>
  </van-col>
</template>
<script lang="ts" setup>

import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useCommonStore } from '../../store';

const router = useRouter()
const i18n = useI18n()
const commonStore = useCommonStore()

onMounted(() => {
  commonStore.navbar.title = i18n.t('settings.sys.about')
})

function gotoAgreementPage(url: string, title: string) {
  router.push({ name: `PrivacyAgreement`, hash: title, params: { url } })
}

</script>
<style scoped>
a {
  color: rgb(54, 142, 220);
}

.footer {
  width: 100%;
  text-align: center;
  font-size: 0.7rem;
  position: absolute;
  bottom: 0;
  margin: 15px auto;
}
</style>