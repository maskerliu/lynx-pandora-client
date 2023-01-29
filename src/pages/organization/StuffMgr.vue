<template>
  <van-col style="height: 100%;">
    <van-list v-model:loading="loading" :finished="finished" @load="loadMore" style="height: 100%; overflow-y: auto;">
      <van-swipe-cell v-for="operator in operators">
        <van-cell :title="operator.name" center>
          <template #value>
            <div style="flex: 1;">
              <van-tag plain type="primary" size="large" v-for="role in operator.roles" style="margin-right: 10px;">
                {{ AllRoles.get(role).name }}
              </van-tag>
            </div>
          </template>
        </van-cell>
        <template #right>
          <van-button square type="danger" style="height: 100%;" :text="$t('common.delete')"
            @click="unbindOperator(operator.uid)" />
          <van-button square type="primary" style="height: 100%;" :text="$t('common.edit')"
            @click="editOperator(operator)" />
        </template>
      </van-swipe-cell>
    </van-list>

    <van-popup position="bottom" v-model:show="showOperatorInfo">
      <van-cell-group :title="$t('company.operator.title')">
        <van-form label-align="right" label-width="5.5rem" colon>
          <van-search v-model="searchPhone" maxlength="11" show-action placeholder="请输入员工的手机号" @search="onSearchUser">
            <template #action>
              <div @click="onSearchUser"> {{ $t('common.search') }}</div>
            </template>
          </van-search>
          <van-field :label="$t('company.operator.name')" :model-value="curOperator?.name" readonly />
          <van-field :label="$t('company.operator.curRoles')">
            <template #input>
              <div style="flex: 1;">
                <van-tag plain type="success" size="large" v-for="role in curOperator?.roles"
                  style="margin: 0 0 10px 10px;" closeable @close="removeOperatorRole(role)">
                  {{ AllRoles.get(role).name }}
                </van-tag>
              </div>
            </template>
          </van-field>
          <van-field :label="$t('company.role.allPrivileges')">
            <template #input>
              <div style="flex: 1;">
                <van-tag plain type="danger" size="large" v-for="role in commonStore.company.roles"
                  style="margin: 0 0 10px 10px;" @click="addOperatorRole(role._id)">
                  {{ role.name }}
                </van-tag>
              </div>
            </template>
          </van-field>

          <van-button type="success" :text="$t('common.save')" @click="saveOperator"
            style="width: calc(100% - 30px); margin: 15px;" />
        </van-form>
      </van-cell-group>

    </van-popup>
  </van-col>
</template>
<script lang="ts" setup>
import { Notify, showNotify } from 'vant'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CommonApi, IOT, IOTApi } from '../../models'
import { useCommonStore } from '../../store'

const commonStore = useCommonStore()
const i18n = useI18n()

const loading = ref(false)
const finished = ref(false)
const showOperatorInfo = ref(false)
const operators = ref<Array<IOT.Operator>>([])
const curOperator = ref<IOT.Operator>(null)
const searchPhone = ref<string>('')

const AllRoles = new Map()
let curPage = 0

onMounted(async () => {
  commonStore.navbar.title = i18n.t('company.operator.title')
  commonStore.navbar.rightText = 'icon-plus'
  commonStore.rightAction = () => { showOperatorInfo.value = true }

  commonStore.company.roles.forEach(it => { AllRoles.set(it._id, it) })
})

async function loadMore() {
  try {
    loading.value = true
    let result = await IOTApi.getOperators(commonStore.company._id, curPage++)
    operators.value.push(...result)
    finished.value = result.length == 0
  } catch (err) {
    finished.value = true
  } finally {
    loading.value = false
  }
}

function editOperator(operator?: IOT.Operator) {
  curOperator.value = operator
  showOperatorInfo.value = true
}

function removeOperatorRole(role: string) {
  let idx = curOperator.value.roles.indexOf(role)
  if (idx != -1)
    curOperator.value.roles.splice(idx, 1)
}

function addOperatorRole(role: string) {
  if (curOperator.value != null) {
    if (curOperator.value.roles == null)
      curOperator.value.roles = []

    if (curOperator.value.roles.indexOf(role) == -1)
      curOperator.value.roles.push(role)
  } else {
    showNotify({ type: 'warning', message: '请先通过手机号搜索要添加的员工' })
  }
}

async function saveOperator() {
  if (curOperator.value.cid == null || curOperator.value.name == null || curOperator.value.roles.length == 0) {
    showNotify({ type: 'warning', message: '员工信息未正确设置' })
  } else {
    await IOTApi.saveOperator(curOperator.value)
    curOperator.value = null
    showOperatorInfo.value = false
  }
}

async function unbindOperator(uid: string) {
  await IOTApi.removeOperator(uid)
  operators.value = await IOTApi.getOperators(commonStore.company._id, curPage)
}

async function onSearchUser() {
  if (/1\d{10}/.test(searchPhone.value)) {
    try {
      let user = await CommonApi.searchUser(searchPhone.value)
      curOperator.value = {
        uid: user?.uid,
        name: user?.name,
        cid: commonStore.company._id
      }
    } catch (err) {
      showNotify({ type: 'warning', message: err.toString(), duration: 800 })
    }
  } else {
    showNotify({ type: 'warning', message: '请输入正确的手机号', duration: 800 })
  }
}


</script>
<style scoped>

</style>