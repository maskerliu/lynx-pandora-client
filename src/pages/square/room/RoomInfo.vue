<template>

  <van-popup :show="show" position="bottom" round @close="emits('update:show', false)"
    style="width: 100%; padding-top: 15px;">
    <van-cell-group>
      <van-form label-align="right" label-width="4.5rem" colon>
        <van-field :label="$t('square.room.create.type')" center>
          <template #input>
            <van-tabs v-model:active="active" type="line" color="#16a085">
              <van-tab v-for="item in RoomTypes" style="margin: 0;">
                <template #title>
                  <van-icon class="iconfont" :class="item.icon" size="28" :color="item.color"
                    style="padding: 0 10px;" />
                </template>
              </van-tab>
            </van-tabs>
          </template>
        </van-field>
        <van-field :label="$t('square.room.create.name')" :placeholder="$t('square.room.create.namePlaceholder')"
          v-model="roomInfo.title" />
        <van-field :label="$t('square.room.create.notice')" :placeholder="$t('square.room.create.noticePlaceholder')"
          type="textarea" rows="2" maxlength="100" show-word-limit v-model="roomInfo.notice" />
        <van-field :label="$t('square.room.create.welcome')" :placeholder="$t('square.room.create.welcomePlaceholder')"
          type="textarea" rows="2" maxlength="100" show-word-limit v-model="roomInfo.welcome" />
        <van-field :label="$t('square.room.create.cover')" input-align="right">
          <template #input>
            <van-uploader width="4rem" height="4rem" v-model="cover" :max-count="1" closeImagePreview
              @click-upload="openFileSelector" />
          </template>
        </van-field>

        <van-field :label="$t('square.room.create.tags')" />
        <van-field :label="$t('square.room.create.master')">
          <template #input>
            <van-col style="flex: 1;">
              <van-search shape="round" show-action v-model="searchKey" @search="searchUser" maxlength="11"
                style="padding: 0; margin-top: -2px;">
                <template #action>
                  <div @click="searchUser">搜索</div>
                </template>
              </van-search>
              <div style="margin-top: 10px;">
                <van-tag plain size="large" closeable style="margin-right: 10px;" @close="removeMaster(user)"
                  v-for="user in roomInfo.displayMasters">
                  {{ user.name }}
                </van-tag>
              </div>

            </van-col>
          </template>
        </van-field>
      </van-form>
    </van-cell-group>
    <van-button type="success" style="width: calc(100% - 30px); margin: 15px;"
      :text="$t(roomInfo._id ? 'common.save' : 'square.room.create.submit')" @click="submit" />
  </van-popup>
</template>
<script lang="ts" setup>
import { showToast, UploaderFileListItem } from 'vant';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Chatroom, User, UserApi } from '../../../models';
import { ChatroomApi } from '../../../models/chatroom.api';
import { useChatroomStore, useCommonStore } from '../../../store';

const props = defineProps<{
  show: boolean
  room?: Chatroom.Room
}>()

const emits = defineEmits(['update:show'])

const commonStore = useCommonStore()
const chatroomStore = useChatroomStore()
const cover = ref<Array<UploaderFileListItem>>([])
const roomInfo = ref<Chatroom.Room>({
  owner: commonStore.profile?.uid,
  displayMasters: []
})
const active = ref(0)
const searchKey = ref('')

let RoomTypes = [
  { type: Chatroom.RoomType.DianTai, icon: 'icon-diantai', desc: '电台', color: '#8e44ad' },
  { type: Chatroom.RoomType.JiaoYou, icon: 'icon-jiaoyou', desc: '交友', color: '#f39c12' },
  { type: Chatroom.RoomType.YuLe, icon: 'icon-yule', desc: '娱乐', color: '#e84393' },
]

onMounted(() => {
  if (window.argus) {
    window.webApp.register(onFileSelect)
  }

  if (props.room) {
    roomInfo.value = props.room
    active.value = props.room.type
    cover.value[0] = {
      url: `//${commonStore.appConfig?.staticServer + props.room.cover}`
    }
  }

})

onBeforeUnmount(async () => {
  if (window.argus) {
    window.webApp.unRegister(onFileSelect.name)
  }
})

function openFileSelector() {
  if (window.argus) {
    window.argus.fileSelect(0, 1)
  }
}

async function onFileSelect(...args: string[]) {
  let resp = await fetch(args[0])
  let blob = await resp.blob()
  let file = new File([blob], 'test.jpeg', { type: blob.type })
  cover.value.push({ file, content: args[0] })
  // await uploadAvatar()
}

async function searchUser() {
  try {
    let user = await UserApi.searchUser(searchKey.value)

    if (roomInfo.value.displayMasters == null) roomInfo.value.displayMasters = []
    roomInfo.value.displayMasters.push(user)
  } catch (err) {
    showToast(err.toString())
  }
}

async function removeMaster(user: User.Profile) {
  let idx = roomInfo.value.displayMasters.findIndex(it => { return it.uid == user.uid })
  roomInfo.value.displayMasters.splice(idx, 1)
}

async function submit() {
  roomInfo.value.type = active.value
  roomInfo.value.masters = roomInfo.value.displayMasters.map(it => { return it.uid })
  await ChatroomApi.saveRoom(roomInfo.value, cover.value[0]?.file)
  emits('update:show', false)
}

</script>
<style scoped>
.test {
  background: #1989fa;
}
</style>