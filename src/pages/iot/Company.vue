<template>
  <van-col style="overflow-y: auto;">
    <van-cell-group :title="$t('company.base.title')">
      <van-form label-align="right" label-width="5.8rem" colon
        :disabled="commonStore.operator?.privileges.indexOf('1') == -1">
        <van-field :label="$t('company.base.name')" v-model="company.name" center clearable>
          <template #button>
            <van-tag plain :color="CompanyStatus[company.status ? company.status : 0].color" size="large">
              {{ CompanyStatus[company.status ? company.status : 0].title }}
            </van-tag>
          </template>
        </van-field>
        <van-field :label="$t('company.base.owner')" v-model="company.ownerName" center disabled />
        <van-field :label="$t('company.base.tel')" v-model="company.tel" center clearable />
        <van-field :label="$t('company.base.address')" v-model="company.address" center clearable />

        <van-button type="primary" @click="saveCompany" v-if="commonStore.operator?.privileges.indexOf('1') != -1"
          :text="company._id == null ? $t('company.base.submit') : $t('common.save')"
          style="width: calc(100% - 30px); margin: 15px;" />
      </van-form>
    </van-cell-group>

    <van-cell-group :title="$t('company.role.title')" v-if="commonStore.operator?.privileges.indexOf('2') != -1">
      <van-cell v-for="role in company.roles" :title="role.name" :label="role.desc" clickable center
        @click="editRole(role)">
        <template #value>
          <van-tag plain type="primary" size="large" v-for="privilege in role.privileges"
            style="margin: 0 0 10px 10px;">
            {{ AllPrivileges.get(privilege)?.name }}
          </van-tag>
        </template>
      </van-cell>
      <van-button type="primary" icon="plus" @click="editRole(null)" :text="$t('company.role.add')"
        style="width: calc(100% - 30px); margin: 15px;" />
    </van-cell-group>

    <van-cell-group :title="$t('company.operator.title')" v-if="commonStore.operator?.privileges.indexOf('3') != -1">
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
      <van-button type="primary" icon="plus" @click="editOperator()" :text="$t('company.operator.add')"
        style="width: calc(100% - 30px); margin: 15px;" />
    </van-cell-group>

    <van-popup position="bottom" v-model:show="showRoleInfo">
      <van-cell-group :title="$t('company.role.title')">
        <van-form label-align="right" label-width="5.5rem" colon>
          <van-field :label="$t('company.role.name')" v-model="curRole.name" clearable />
          <van-field :label="$t('company.role.desc')" v-model="curRole.desc" type="textarea" maxlength="50" rows="2"
            show-word-limit clearable />
          <van-field :label="$t('company.role.curPrivileges')">
            <template #input>
              <div style="flex: 1;">
                <van-tag plain type="primary" size="large" v-for="privilege in curRole.privileges"
                  style="margin: 10px 10px 0 0;" closeable @close="removePrivilege(privilege)">
                  {{ AllPrivileges.get(privilege).name }}
                </van-tag>
              </div>
            </template>
          </van-field>
          <van-field :label="$t('company.role.allPrivileges')">
            <template #input>
              <div style="flex: 1;">
                <van-tag plain type="danger" size="large" v-for="privilege in company.privileges"
                  style="margin: 10px 10px 0 0;" @click="addPrivilege(privilege.id)">
                  {{ privilege.name }}
                </van-tag>
              </div>
            </template>
          </van-field>
          <van-button type="danger" @click="deleteRole" :text="$t('common.delete')" v-if="curRole._id != null"
            style="width: calc(100% - 30px); margin: 15px;" />
          <van-button type="success" @click="saveRole" :text="$t('common.save')"
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
                <van-tag plain type="danger" size="large" v-for="role in company.roles" style="margin: 0 0 10px 10px;"
                  @click="addOperatorRole(role._id)">
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
import { Notify } from 'vant';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { CommonApi, IOT, IOTApi } from '../../models';
import { useCommonStore } from '../../store';

const commonStore = useCommonStore()
const i18n = useI18n()

const company = ref<IOT.Company>({})
const showRoleInfo = ref(false)
const curRole = ref<IOT.Role>(null)

const showOperatorInfo = ref(false)
const operators = ref<Array<IOT.Operator>>([])
const curOperator = ref<IOT.Operator>(null)
const searchPhone = ref<string>('')

const AllRoles = new Map()

const CompanyStatus = [
  { title: '创建中', color: '#3498db' },
  { title: '认证中', color: '#e67e22' },
  { title: '通过认证', color: '#2ecc71' },
  { title: '注销', color: '#bdc3c7' }
]

const AllPrivileges = ref<Map<string, IOT.Privilege>>(new Map())

onMounted(async () => {
  if (commonStore.company != null) {
    company.value = commonStore.company

    commonStore.navbar.title = i18n.t('company.title')
    if (commonStore.operator.privileges.indexOf('2') != -1) {
      company.value.roles = await IOTApi.getRoles(company.value._id)
    }

    if (commonStore.operator.privileges.indexOf('3') != -1) {
      operators.value = await IOTApi.getOperators(company.value._id)
    }

    company.value.privileges?.forEach(it => { AllPrivileges.value.set(it.id, it) })
    company.value.roles.forEach(it => { AllRoles.set(it._id, it) })
  } else {
    company.value.owner = commonStore.profile?.uid
    company.value.ownerName = commonStore.profile?.name
    company.value.tel = commonStore.profile?.phone
  }
})

async function saveCompany() {
  delete company.value.privileges
  delete company.value.ownerName

  company.value.status = IOT.CompanyStatus.Verifing
  await IOTApi.saveCompany(company.value)
  await commonStore.updateUserInfo()
}

function editRole(role: IOT.Role) {
  showRoleInfo.value = true
  if (role == null) {
    role = { cid: company.value._id, desc: '', name: '', privileges: [] }
  }
  curRole.value = role
}

async function deleteRole() {
  await IOTApi.deleteRole(curRole.value._id)
  Notify({ type: 'success', message: '删除成功', duration: 500 })
  company.value.roles = await IOTApi.getRoles(commonStore.operator?.cid)
  curRole.value = {}
  showRoleInfo.value = false
}

async function saveRole() {
  await IOTApi.saveRole(curRole.value)
  Notify({ type: 'success', message: '更新功', duration: 500 })
  curRole.value = {}
  showRoleInfo.value = false
  company.value.roles = await IOTApi.getRoles(commonStore.operator?.cid)
}

function addPrivilege(privilege: string) {
  if (curRole.value.privileges.indexOf(privilege) == -1)
    curRole.value.privileges.push(privilege)
}

function removePrivilege(privilege: string) {
  let idx = curRole.value.privileges.findIndex((item) => { return item == privilege })
  if (idx != -1)
    curRole.value.privileges.splice(idx, 1)
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
    Notify({ type: 'warning', message: '请先通过手机号搜索要添加的员工' })
  }
}

async function saveOperator() {
  if (curOperator.value.cid == null || curOperator.value.name == null || curOperator.value.roles.length == 0) {
    Notify({ type: 'warning', message: '员工信息未正确设置' })
  } else {
    await IOTApi.saveOperator(curOperator.value)
    curOperator.value = null
    showOperatorInfo.value = false
  }
}

async function unbindOperator(uid: string) {
  await IOTApi.removeOperator(uid)
  operators.value = await IOTApi.getOperators(company.value._id)
}

async function onSearchUser() {
  if (/1\d{10}/.test(searchPhone.value)) {
    try {
      let user = await CommonApi.searchUser(searchPhone.value)
      curOperator.value = {
        uid: user?.uid,
        name: user?.name,
        cid: company.value._id
      }
    } catch (err) {
      Notify({ type: 'warning', message: err.toString(), duration: 800 })
    }
  } else {
    Notify({ type: 'warning', message: '请输入正确的手机号', duration: 800 })
  }
}

</script>
<style scoped>

</style>