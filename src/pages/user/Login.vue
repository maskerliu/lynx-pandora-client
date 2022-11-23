<template>

  <van-row class="full-row">
    <van-form style="width: 100%; margin: 15px; text-align: center;">
      <van-icon class="iconfont icon-iot" size="40" color="green" style="margin: 20px auto;" />
      <van-field v-model="phone" type="tel" left-icon="phone-o" maxlength="11" size="large" clearable
        :placeholder="$t('login.phone')">
        <template #left-icon>
          <van-icon name="phone-o" size="20" />
        </template>
        <template #button>
          <van-button size="small" :disabled="!phoneVaildate" type="primary">{{ $t('login.sendMsg') }}</van-button>
        </template>
      </van-field>
      <van-password-input v-if="phoneVaildate" :gutter="20" :length="4" :value="validateCode" :focused="showKeyboard"
        :mask="false" @focus="showKeyboard = true" style="margin: 15px 0;" />
      <van-number-keyboard v-model="validateCode" :show="showKeyboard" @blur="showKeyboard = false" />
      <van-button plain style="width: 100%;" v-if="showLoginBtn" @click="login">{{ $t('login.done') }}
      </van-button>
    </van-form>
    <van-row style="width: 100%;">

    </van-row>
  </van-row>

</template>
<script lang="ts" setup>

import { ref, watch } from 'vue'
import { useCommonStore } from '../../store'


const phone = ref('')
const validateCode = ref('')
const phoneVaildate = ref(false)
const showKeyboard = ref(false)
const showLoginBtn = ref(false)

const commonStore = useCommonStore()

const validator = (val: string) => {
  let result = /1\d{10}/.test(val)
  phoneVaildate.value = result
  if (!result) {
    validateCode.value = ''
  }
  return result
}

watch(phone, () => {
  let result = /1\d{10}/.test(phone.value)
  phoneVaildate.value = result
  if (!result) {
    validateCode.value = ''
  }
})

watch(validateCode, () => {
  if (validateCode.value?.length >= 4) {
    showLoginBtn.value = true
    validateCode.value = validateCode.value.substring(0, 4)
  } else {
    showLoginBtn.value = false
  }
})

function login() {
  commonStore.needLogin = false
}

</script>
<style>

</style>