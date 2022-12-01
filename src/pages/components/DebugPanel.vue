<template>
  <div class="drag-ball" ref="dragBall" @touchstart.stop="touchStart" @touchmove.prevent="touchMove"
    @touchend.stop="touchEnd" @mousedown.prevent="touchStart" @mousemove.prevent="touchMove"
    @mouseup.prevent="touchEnd">
    <van-popover v-model:show="showPopover" theme="light" placement="left">
      <template #reference>
        <van-button plain hairline round @click="showPopover = true" style="width: 60px; height: 60px;">
          <van-icon class="iconfont icon-debug" name="bug" size="30" color="#e17055" />
        </van-button>
      </template>
      <van-col style="width: calc(100vw - 100px); height: 300px; padding: 10px;">
        <van-button plain type="primary" text="DB Mgr" @click="$router.push('/dbmgr'); showPopover = false;" />
      </van-col>
    </van-popover>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const dragBall = ref()
const showPopover = ref(false)

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
      } else {
        dragBall.value.style.left = 0 + 'px'
      }
    }

    inset = { left: 0, top: 0 }
    move = { x: 0, y: 0 }
    position = { left: 0, top: 0 }
    canDrag = false
  }
}

function getPosition(source: any) {
  let left = source.offsetLeft //获取元素相对于其父元素的left值var left
  let top = source.offsetTop
  let current = source.offsetParent // 取得元素的offsetParent // 一直循环直到根元素
  while (current != null) {
    left += current.offsetLeft
    top += current.offsetTop
    current = current.offsetParent
  }
  return { left: left, top: top }
}

</script>

<style scoped>
.drag-ball {
  position: absolute;
  z-index: 10003;
  right: 0;
  top: 70%;
  width: 60px;
  height: 60px;
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
