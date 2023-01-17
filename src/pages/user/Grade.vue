<template>

  <van-col>
    <div style="position: relative; margin: 15px;">
      <span style="font-size: 2.5rem; color: #d35400">776</span>
      <div class="grade-tips">距离下一级还差224分</div>
    </div>

    <van-row class="bg-border" style="text-align: center; background: white;">
      <van-col span="8" style="padding: 15px;">
        <van-image width="2rem" height="2rem" />
        <div>积分翻倍</div>
      </van-col>
      <van-col span="8" style="padding: 15px;">
        <van-image width="2rem" height="2rem" />
        <div>礼物95折</div>
      </van-col>
      <van-col span="8" style="padding: 15px;">
        <van-image width="2rem" height="2rem" />
        <div>24小时服务</div>
      </van-col>
    </van-row>

    <van-row class="bg-border" style="background: white; margin-top: 15px;">
      <h4 style="padding: 0 20px;">如何提升等级</h4>
      <van-cell title="发表文章" label="发表文章可收获10点等级分，您的文章收获的评论、点赞越多，也会获得相应的等级积分哟" center>
        <template #icon>
          <van-icon class="iconfont icon-post" size="2rem" style="margin-right: 10px;" />
        </template>
        <template #right-icon>
          <van-button round size="mini" text=" 写一篇 " />
        </template>
      </van-cell>

      <van-cell title="点赞/评论" label="友善的给别人的文章或动态留言或点赞也会获得一定的等级积分哟" center>
        <template #icon>
          <van-icon class="iconfont icon-comment" size="2rem" style="margin-right: 10px;" />
        </template>
        <template #right-icon>
          <van-button round size="mini" text=" 去评价 " />
        </template>
      </van-cell>

      <van-cell title="开通频道" label="创建自己的频道，并积极经营，保持频道活跃，将会持续获得积分奖励哟" center>
        <template #icon>
          <van-icon class="iconfont icon-channel" size="2rem" style="margin-right: 10px;" />
        </template>
        <template #right-icon>
          <van-button round size="mini" text=" 去创建 " />
        </template>
      </van-cell>

      <van-cell title="频道互动" label="加入他人的频道，并积极参与互动可获得大量等级分" center>
        <template #icon>
          <van-icon class="iconfont icon-gift" size="2rem" style="margin-right: 10px;" />
        </template>
        <template #right-icon>
          <van-button round size="mini" text=" 去互动 " />
        </template>
      </van-cell>
    </van-row>
  </van-col>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCommonStore } from '../../store'

const i18n=useI18n()
const commonStore = useCommonStore()

onMounted(() => {
  commonStore.navbar.title = i18n.t('mine.grade')
})
</script>
<style scoped>
.grade-tips {
  position: absolute;
  top: 0;
  right: 100px;
  color: white;
  font-size: 0.8rem;
  background: linear-gradient(94deg, #e67e22, #d35400);
  border-radius: 15px 15px 15px 5px;
  padding: 5px 10px;
}
</style>