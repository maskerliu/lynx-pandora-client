<template>
  <van-col style="overflow-y: auto;">
    <van-cell-group :title="$t('company.base.title')">
      <van-form label-align="right" label-width="5.8rem" colon>
        <van-field :label="$t('company.base.name')" v-model="commonStore.company.name" center clearable>
          <template #button>
            <van-tag plain type="danger" size="large">{{ commonStore.company.status }}</van-tag>
          </template>
        </van-field>
        <van-field :label="$t('company.base.owner')" v-model="commonStore.company.ownerName" center disabled />
        <van-field :label="$t('company.base.tel')" v-model="commonStore.company.tel" center  clearable/>
        <van-field :label="$t('company.base.address')" v-model="commonStore.company.address" center clearable/>

        <van-button type="primary" @click="saveCompany"
          :text="commonStore.company._id == null ? $t('company.base.submit') : $t('common.save')"
          style="width: calc(100% - 30px); margin: 15px;" />
      </van-form>
    </van-cell-group>

    <van-cell-group :title="$t('company.role.title')">
      <van-cell v-for="role in commonStore.company.roles" :title="role.name" :label="role.desc" clickable center
        @click="editRole(role)">
        <template #value>
          <van-tag plain type="primary" v-for="privilege in role.privileges" style="margin: 0 0 10px 10px;">
            {{ AllPrivileges.get(privilege)?.name }}
          </van-tag>
        </template>
      </van-cell>
      <van-button plain type="warning" icon="plus" @click="editRole(null)" :text="$t('company.role.add')"
        style="width: calc(100% - 30px); margin: 15px;" />
    </van-cell-group>

    <van-cell-group :title="$t('company.operator.title')">
      <van-swipe-cell v-for="operator in operators">
        <van-cell :title="operator.name">
          <template #value>
            <div style="flex: 1;">
              <van-tag plain type="primary" v-for="rid in operator.roles" style="margin: 0 0 10px 10px;">
                {{ AllRoles.get(rid).name }}
              </van-tag>
            </div>
          </template>
        </van-cell>
        <template #right>
          <van-button square type="danger" style="height: 100%;" :text="$t('common.delete')" @click="" />
          <van-button square type="primary" style="height: 100%;" :text="$t('common.edit')"
            @click="editOperator(operator)" />
        </template>
      </van-swipe-cell>
      <van-button type="success" icon="plus" @click="editOperator()" :text="$t('company.operator.add')"
        style="width: calc(100% - 30px); margin: 15px;" />
    </van-cell-group>

    <van-popup position="bottom" v-model:show="showRoleInfo">
      <van-cell-group :title="$t('company.role.title')">
        <van-form label-align="right" label-width="5.5rem" colon>
          <van-field :label="$t('company.role.name')" v-model="curRole.name" clearable />
          <van-field :label="$t('company.role.desc')" v-model="curRole.desc" clearable />
          <van-field :label="$t('company.role.curPrivileges')">
            <template #input>
              <div style="flex: 1;">
                <van-tag plain type="success" size="large" v-for="privilege in curRole.privileges"
                  style="margin: 10px 0 0 10px;" closeable @close="removePrivilege(privilege)">
                  {{ AllPrivileges.get(privilege).name }}
                </van-tag>
              </div>
            </template>
          </van-field>
          <van-field :label="$t('company.role.allPrivileges')">
            <template #input>
              <div style="flex: 1;">
                <van-tag plain type="danger" size="large" v-for="privilege in commonStore.company.privileges"
                  style="margin: 0 0 10px 10px;" @click="addPrivilege(privilege.id)">
                  {{ privilege.name }}
                </van-tag>
              </div>
            </template>
          </van-field>
          <van-button round type="danger" @click="deleteRole" :text="$t('common.delete')" v-if="curRole._id != null"
            style="width: calc(100% - 30px); margin: 15px;" />
          <van-button round type="success" @click="saveRole" :text="$t('common.save')"
            style="width: calc(100% - 30px); margin: 0 15px 15px 15px;" />
        </van-form>
      </van-cell-group>

    </van-popup>

    <van-popup position="bottom" v-model:show="showOperatorInfo">
      <van-cell-group :title="$t('company.operator.title')">
        <van-form label-align="right" label-width="5.5rem" colon>
          <van-search v-model="searchPhone" maxlength="11" show-action placeholder="请输入员工的手机号" @search="onSearchUser">
            <template #action>
              <div @click="onSearchUser"> {{ $t('common.search') }}</div>
            </template>
          </van-search>
          <van-field :label="$t('company.operator.name')" v-model="curOperator.name" disabled />
          <van-field :label="$t('company.operator.curRoles')">
            <template #input>
              <div style="flex: 1;">
                <van-tag plain type="success" size="large" v-for="role in curOperator.roles"
                  style="margin: 10px 0 0 10px;" closeable @close="removeOperatorRole(role)">
                  {{ AllRoles.get(role)?.name }}
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

          <van-button round type="success" :text="$t('common.save')" @click="saveOperator"
            style="width: calc(100% - 30px); margin: 15px;" />
        </van-form>
      </van-cell-group>

    </van-popup>
  </van-col>
</template>
<script lang="ts" setup>

import { Notify } from 'vant'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CommonApi, IOT, IOTApi } from '../../models'
import { useCommonStore } from '../../store'

const i18n = useI18n()
const commonStore = useCommonStore()
const showRoleInfo = ref(false)
const showOperatorInfo = ref(false)

const operators = ref<Array<IOT.Operator>>()
const curRole = ref<IOT.Role>(null)
const curOperator = ref<IOT.Operator>(null)
const searchPhone = ref<string>('')

const AllPrivileges = ref<Map<string, IOT.Privilege>>(new Map())
const AllRoles = ref<Map<string, IOT.Role>>(new Map())

onMounted(async () => {

  commonStore.navbar.title = i18n.t('company.title')

  if (commonStore.company._id != null) {
    commonStore.company.roles = await IOTApi.getRoles(commonStore.company._id)
    operators.value = await IOTApi.getOperators(commonStore.company._id)
    commonStore.company.privileges?.forEach(it => { AllPrivileges.value.set(it.id, it) })
    commonStore.company.roles?.forEach(it => { AllRoles.value.set(it._id, it) })
  } else {
    commonStore.company.owner = commonStore.profile.uid
    commonStore.company.ownerName = commonStore.profile.name
    commonStore.company.tel = commonStore.profile.phone
  }
})

async function saveCompany() {
  let data = commonStore.company
  delete data.privileges
  delete data.ownerName
  commonStore.company.status = 1
  await IOTApi.saveCompany(data)
  await commonStore.updateCompanyInfo()
}

function editRole(role: IOT.Role) {
  showRoleInfo.value = true
  if (role == null) {
    role = { cid: commonStore.company._id, desc: '', name: '', privileges: [] }
  }
  curRole.value = role
}

async function deleteRole() {
  await IOTApi.deleteRole(curRole.value._id)
  Notify({ type: 'success', message: '删除成功', duration: 500 })
  commonStore.updateCompanyInfo()
  curRole.value = {}
  showRoleInfo.value = false
  await commonStore.updateCompanyInfo()
}

async function saveRole() {
  await IOTApi.saveRole(curRole.value)
  Notify({ type: 'success', message: '更新功', duration: 500 })
  curRole.value = {}
  showRoleInfo.value = false
  await commonStore.updateCompanyInfo()
}

function addPrivilege(privilege: string) {
  let idx = curRole.value.privileges.findIndex((item) => { return item == privilege })
  if (idx == -1)
    curRole.value.privileges.push(privilege)
}

function removePrivilege(privilege: string) {
  let idx = curRole.value.privileges.findIndex((item) => { return item == privilege })
  curRole.value.privileges.splice(idx, 1)
}

function editOperator(operator?: IOT.Operator) {
  if (operator == null) {
    operator = { uid: '', name: '', roles: [], cid: commonStore.company._id }
  }
  curOperator.value = operator
  showOperatorInfo.value = true
}

function removeOperatorRole(role: string) {
  let idx = curOperator.value.roles.findIndex((item) => { return item == role })
  curOperator.value.roles.splice(idx, 1)
}

function addOperatorRole(role: string) {
  let idx = curOperator.value.roles.findIndex((item) => { return item == role })
  if (idx == -1)
    curOperator.value.roles.push(role)
}

async function saveOperator() {
  if (curOperator.value.cid == null || curOperator.value.name == null || curOperator.value.roles.length == 0) {
    Notify({ type: 'warning', message: '员工信息未正确设置' })
  } else {
    await IOTApi.saveOperator(curOperator.value)
  }
}

async function onSearchUser() {
  console.log(searchPhone.value)
  console.log(/1\d{10}/.test(searchPhone.value))
  if (/1\d{10}/.test(searchPhone.value)) {
    let user = await CommonApi.searchUser(searchPhone.value)
    curOperator.value.name = user?.name
    curOperator.value.uid = user?._id
  } else {
    Notify({ type: 'warning', message: '请输入正确的手机号', duration: 800 })
  }
}


</script>
<style scoped>

</style>