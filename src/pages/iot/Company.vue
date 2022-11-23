<template>
  <van-row style="overflow-y: auto;">
    <van-cell-group title="基本信息" style="width: 100%;">
      <van-form style="width: 100%;">
        <van-field label="公司名"></van-field>
        <van-field label="联系电话"></van-field>
        <van-field label="公司名"></van-field>
        <van-field label="联系电话"></van-field>
      </van-form>
    </van-cell-group>
    <van-cell-group title="人员管理" style="width: 100%;">
      <van-swipe-cell v-for="i in 10">
        <van-cell :border="false" :title="`张-${i}`" size="large">
          <template #value>
            <van-tag type="primary">管理员</van-tag>
            <van-tag type="danger" v-if="i % 3 == 0" style="margin-left: 10px;">超级管理员</van-tag>
            <van-tag type="success" v-if="i % 3 == 1" style="margin-left: 10px;">工人</van-tag>
          </template>
        </van-cell>
        <template #right>
          <van-button square type="danger" text="删除" />
          <van-button square type="primary" text="编辑" />
        </template>
      </van-swipe-cell>
    </van-cell-group>

    <van-cell-group title="设备管理" style="width: 100%;">
      <van-swipe-cell v-for="i in 10">
        <van-cell :border="false" :title="`张-${i}`" size="large">
          <template #value>
            <van-tag type="primary">管理员</van-tag>
            <van-tag type="danger" v-if="i % 3 == 0" style="margin-left: 10px;">超级管理员</van-tag>
            <van-tag type="success" v-if="i % 3 == 1" style="margin-left: 10px;">工人</van-tag>
          </template>
        </van-cell>
        <template #right>
          <van-button square type="danger" text="删除" />
          <van-button square type="primary" text="编辑" />
        </template>
      </van-swipe-cell>
    </van-cell-group>
  </van-row>
</template>
<script lang="ts" setup>
</script>
<style scoped>

</style>