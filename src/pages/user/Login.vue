<template>

  <van-col style="background-color: #f1f1f1;">
    <van-form style="margin: 15px; text-align: center;">
      <van-icon class="iconfont icon-iot" size="40" color="green" style="margin: 20px auto;" />
      <van-field v-model="phone" type="tel" left-icon="phone-o" maxlength="11" input-align="center" clickable readonly
        :placeholder="$t('login.phone')" @click="showKeyboard = true; enterVerifyCode = false;">
        <template #left-icon>
          <van-icon name="phone-o" size="20" style="margin-top: 5px;" />
        </template>
        <template #button>
          <van-button size="small" :disabled="!phoneVaildate" type="primary" :text="$t('login.sendMsg')" />
        </template>
      </van-field>
      <van-password-input :disabled="phoneVaildate" :gutter="2" :length="4" :value="verifyCode"
        :focused="enterVerifyCode" :mask="false" @focus="showKeyboard = true; enterVerifyCode = true"
        style="margin: 15px 0;" />
      <van-number-keyboard v-model="input" :show="showKeyboard" @blur="showKeyboard = false" />
      <van-button type="primary" style="width: 100%;" :disabled="!showLoginBtn" @click="login"
        :text="$t('login.done')" />
    </van-form>
  </van-col>

</template>
<script lang="ts" setup>

import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CommonApi, updateAccessToken } from '../../models';
import { useCommonStore } from '../../store';


const phone = ref('')
const verifyCode = ref('')
const input = ref('')
const enterVerifyCode = ref(false)
const phoneVaildate = ref(false)
const showKeyboard = ref(true)
const showLoginBtn = ref(false)

const formatter = (value: string) => value.replace(/^(.{3})(.{4})?(.*)$/, '$1 $2 $3')

const commonStore = useCommonStore()
const router = useRouter()
const route = useRoute()
const phoneReg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
onMounted(() => {
  let test = '136519442'
  let reg: RegExp = /(\d{3})()*$/g
  let arr = test.match(reg)
  console.log(arr)
  let str = 'food'
  console.log(str.match(/^(o)*$/g))
})

watch(input, () => {
  if (enterVerifyCode.value) {
    input.value = input.value.substring(0, 4)
    verifyCode.value = input.value
  } else {
    // .replace(/^(.{3})(.{0, 4})?(.*)$/, '$1 $2 $3')
    input.value = input.value.substring(0, 11)
    phone.value = input.value
  }
})


watch(enterVerifyCode, () => {
  if (enterVerifyCode.value) {
    input.value = verifyCode.value
  } else {
    input.value = phone.value
  }
})

watch(phone, () => {
  let result = phoneReg.test(phone.value)
  phoneVaildate.value = /^1\d{10}$/.test(phone.value)
})

watch(verifyCode, () => {
  if (verifyCode.value?.length >= 4) {
    showLoginBtn.value = true
    verifyCode.value = verifyCode.value.substring(0, 4)
  } else {
    showLoginBtn.value = false
  }
})

async function login() {
  commonStore.needLogin = false
  commonStore.accessToken = await CommonApi.login(phone.value, verifyCode.value)
  updateAccessToken(commonStore.accessToken)
}

</script>
<style>

</style>