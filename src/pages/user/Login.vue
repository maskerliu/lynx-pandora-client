<template>
  <van-popup position="bottom" style="width: 100%; height: 560px; background-color: #f1f1f1;"
    v-model:show="commonStore.needLogin">
    <van-form style="margin: 15px; text-align: center;">
      <van-icon class="iconfont icon-iot" size="40" color="green" style="margin: 20px auto;" />
      <van-field v-model="phone" type="tel" left-icon="phone-o" maxlength="13" input-align="center" clickable readonly
        :placeholder="$t('login.phone')" @click="showKeyboard = true; enterVerifyCode = false;">
        <template #left-icon>
          <van-icon name="phone-o" size="20" style="margin-top: 5px;" />
        </template>
        <template #button>
          <van-button size="small" :disabled="!phoneVaildate" type="primary" :text="$t('login.sendVerifyCode')"
            @click="sendVerifyCode" />
        </template>
      </van-field>
      <van-password-input :disabled="!phoneVaildate" :gutter="2" :length="4" :value="verifyCode"
        :focused="enterVerifyCode" :mask="false" @focus="showKeyboard = true; enterVerifyCode = true"
        style="margin: 15px 0;" />
      <van-number-keyboard v-model="input" :show="showKeyboard" @blur="showKeyboard = false" />
      <van-button type="primary" :loading="isLogining" style="width: 100%;" :disabled="!showLoginBtn || isLogining"
        @click="login" :text="$t('login.done')" />
    </van-form>
  </van-popup>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { CommonApi } from '../../models';
import { useCommonStore } from '../../store';


const router = useRouter()
const commonStore = useCommonStore()

const phone = ref('')
const verifyCode = ref('')
const input = ref('')
const enterVerifyCode = ref(false)
const phoneVaildate = ref(false)
const showKeyboard = ref(false)
const showLoginBtn = ref(false)
const isLogining = ref(false)

const formatter = (value: string) => value.replace(/^(.{3})(.{4})?(.*)$/, '$1 $2 $3')

const phoneReg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/

onMounted(() => {

})

watch(input, () => {
  if (enterVerifyCode.value) {
    input.value = input.value.substring(0, 4)
    verifyCode.value = input.value
  } else {
    input.value = input.value.substring(0, 11)

    if (input.value.length == 11) {
      phone.value = formatter(input.value)
    } else {
      phone.value = input.value
    }
  }
})

watch(enterVerifyCode, () => {
  if (enterVerifyCode.value) {
    input.value = verifyCode.value
  } else {
    input.value = phone.value.replaceAll(' ', '')
  }
})

watch(phone, () => {
  let result = phoneReg.test(input.value)
  phoneVaildate.value = phoneReg.test(input.value)
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
  isLogining.value = true
  commonStore.accessToken = await CommonApi.login(phone.value.replaceAll(' ', ''), verifyCode.value)
  await commonStore.updateUserInfo()
  input.value = ''
  verifyCode.value = ''
  phone.value = ''
  isLogining.value = false
  commonStore.needLogin = false

  if (commonStore.forword) {
    router.push(commonStore.forword)
    commonStore.forword = null
  }
}

function sendVerifyCode() {
  enterVerifyCode.value = true
}

</script>
<style>

</style>