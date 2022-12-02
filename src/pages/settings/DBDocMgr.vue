<template>
  <van-list style="overflow-y: auto;">
    <van-cell v-for="doc in docs" :title="doc.id" title-class="van-ellipsis" label-class="van-ellipsis" is-link @click="onShowDetail(doc)">
      <template #label>
        {{ doc.value }}
      </template>
    </van-cell>
    <van-popup v-model:show="showDetail" position="bottom" style="width: 100%; height: 60%;">
      <ace-editor :disable="disable" style="width: 100%; height: calc(100% - 150px); margin-top: 15px;"
        v-model:content="content" lang="json" :options="{ showPrintMargin: false }" />
      <van-button :disabled="disable" type="primary" style="width: calc(100% - 30px); margin: 15px;"
        :text="$t('common.save')" />
      <van-button :disabled="disable" type="danger" style="width: calc(100% - 30px); margin:0 15px 15px 15px;"
        :text="$t('common.delete')" />
    </van-popup>
  </van-list>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { CommonApi } from '../../models'
import { useRoute } from 'vue-router'
import AceEditor from '../components/VueAceEditor.vue'
import { useCommonStore } from '../../store'

const commonStore = useCommonStore()
const route = useRoute()
const docs = ref([])
const showDetail = ref(false)
const disable = ref(false)
const content = ref<string>('')

onMounted(async () => {
  commonStore.navbar.title = 'DB Doc Manage'
  
  let result = await CommonApi.getAllDocs(route.params['db'] as string)

  docs.value = result.rows
})

function onShowDetail(doc: any) {
  disable.value = doc.id.indexOf('_design') != -1
  if (doc.doc != null) {
    content.value = JSON.stringify(doc.doc, null, '\t')
    showDetail.value = true
  }
}

</script>
<style scoped>

</style>