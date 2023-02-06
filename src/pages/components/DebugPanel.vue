<template>
  <div class="drag-ball" ref="dragBall" @touchstart.stop="touchStart" @touchmove.prevent.stop="touchMove"
    @touchend.stop="touchEnd" @mousedown.prevent.stop="touchStart" @mousemove.prevent.stop="touchMove"
    @mouseup.prevent.stop="touchEnd">
    <van-popover v-model:show="showDebugPanel" :close-on-click-outside="true" theme="light" placement="left">
      <template #reference>
        <van-button plain hairline round style="width: 60px; height: 60px;">
          <van-icon class="iconfont icon-debug" name="bug" size="30" color="#e17055" />
        </van-button>
      </template>
      <van-col style="width: calc(100vw - 100px); height: 300px; overflow-y: auto; padding: 10px;">
        <van-button plain block type="primary" size="small" text="Clear Local Data" @click="cleanLocalData" />

        <van-button plain block type="primary" size="small" text="Clear Local DB" @click="cleanLocalDB"
          style="margin-top: 15px;" />
        <van-button plain block type="primary" size="small" text="Compact LocalStorage" @click="compactStorage"
          :loading="compacting" style="margin-top: 15px;" />
        <van-button plain block type="danger" size="small" text="Mock Users" @click="genMockUsers"
          style="margin-top: 15px;" />

        <van-button plain block type="danger" size="small" text="IM(p2p) Mock" @click="genMockP2PMessages"
          style="margin-top: 15px;" />

        <van-button plain block type="danger" size="small" text="IM(group) Mock" @click="genMockGroupMessages"
          style="margin-top: 15px;" />

        <van-button plain block type="success" size="small" text="Chatroom Msg Mock" @click="mockChatroomMsgs"
          style="margin-top: 15px;" />
      </van-col>
    </van-popover>
  </div>
</template>

<script lang="ts" setup>
import md5 from 'md5';
import PouchDB from 'pouchdb';
import { ref } from 'vue';
import { IM, UserApi } from '../../models';
import { useChatroomStore, useCommonStore, useIMStore } from '../../store';

const dragBall = ref()
const showDebugPanel = ref(false)
const compacting = ref(false)

const commonStore = useCommonStore()
const chatroomStore = useChatroomStore()
const imStore = useIMStore()

let canDrag = false
let inset = { left: 0, top: 0, }
let move = { x: 0, y: 0 } // 移动
let position = { left: 0, top: 0, } // 位置
let positionOld = { left: 0, top: 0 } // 初始位置 
let startTime = 0
let endTime = 0

function touchStart(event: any) {
  if (canDrag) return

  startTime = event.timeStamp
  positionOld = getPosition(dragBall.value)
  position = { ...positionOld }
  canDrag = true

  if (event.type == 'touchstart') {
    let e: TouchEvent = event
    inset = {
      left: e.targetTouches[0].clientX - positionOld.left,
      top: e.targetTouches[0].clientY - positionOld.top,
    }
  }

  if (event.type == 'mousestart') {
    let e: MouseEvent = event
    inset = {
      left: e.clientX - positionOld.left,
      top: e.clientY - positionOld.top,
    }
  }
}

function touchMove(event: any) {
  if (!canDrag) return

  let left = 0
  let top = 0

  if (event.type == 'touchmove') {
    let e = event as TouchEvent
    left = e.targetTouches[0].clientX - inset.left
    top = e.targetTouches[0].clientY - inset.top
  }

  if (event.type == 'mousemove') {
    let e = event as MouseEvent
    left = e.clientX - inset.left
    top = e.clientY - inset.top
  }

  if (left < 0) {
    left = 0
  } else if (left > window.innerWidth - dragBall.value.offsetWidth) {
    left = window.innerWidth - dragBall.value.offsetWidth
  }
  if (top < 0) {
    top = 0
  } else if (top > window.innerHeight - dragBall.value.offsetHeight) {
    top = window.innerHeight - dragBall.value.offsetHeight
  }
  dragBall.value.style.left = left + 'px'
  dragBall.value.style.top = top + 'px'
  move = {
    x: left - positionOld.left,
    y: top - positionOld.top,
  }
  position = { left, top }
}

function touchEnd(e: any) {
  if (canDrag) {
    endTime = e.timeStamp
    if (
      endTime - startTime > 400 ||
      Math.abs(move.x) > 2 ||
      Math.abs(move.y) > 2
    ) {
      // 非单击事件
      if (position.left + dragBall.value.offsetWidth / 2 > window.innerWidth / 2) {
        dragBall.value.style.left =
          window.innerWidth - dragBall.value.offsetWidth + 'px'

        showDebugPanel.value = false
      } else {
        dragBall.value.style.left = 0 + 'px'
        showDebugPanel.value = true
      }
    }

    inset = { left: 0, top: 0 }
    move = { x: 0, y: 0 }
    position = { left: 0, top: 0 }
    canDrag = false
  }
}

function getPosition(source: any) {
  let left = source.offsetLeft
  let top = source.offsetTop
  let current = source.offsetParent
  while (current != null) {
    left += current.offsetLeft
    top += current.offsetTop
    current = current.offsetParent
  }
  return { left: left, top: top }
}

async function cleanLocalData() {
  await commonStore.logout()
  showDebugPanel.value = false
}

async function cleanLocalDB() {
  let dbs = ['im-sessions.db', 'im-messages.db']
  for (let i = 0; i < dbs.length; ++i) {
    let db = new PouchDB(dbs[i])
    await db.destroy()
  }
  showDebugPanel.value = false
}

async function compactStorage() {
  compacting.value = true
  let dbs = ['im-sessions.db', 'im-messages.db']
  for (let i = 0; i < dbs.length; ++i) {
    let db = new PouchDB(dbs[i])
    await db.compact()
  }
  compacting.value = false
  showDebugPanel.value = false
}

async function genMockUsers() {
  // for (let i = 0; i < 100; ++i) {
  //   let end = i.toString().padStart(2, '0')
  //   await CommonApi.login(`136518888${end}`, '2222')
  // }

  showDebugPanel.value = false
}

async function genMockP2PMessages() {
  await imStore.mockMessages(commonStore.profile.uid)
  showDebugPanel.value = false
}

async function genMockGroupMessages() {
  showDebugPanel.value = false
}

async function mockChatroomMsgs() {
  chatroomStore.mockMessages()
  showDebugPanel.value = false
}

</script>

<style scoped>
.drag-ball {
  position: absolute;
  z-index: 10003;
  right: 0;
  top: 70%;
  width: 45px;
  height: 45px;
  background: #e1e1e188;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0px 0px 10px 2px skyblue;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}
</style>
