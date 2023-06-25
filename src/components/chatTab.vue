<template>
  <div class="home">
    <div :class="{tabBox:true,active:isActive}">
      <div class="title" @click="handleClick">
        {{ props.title }}
      </div>
<!--      <div class="closeBtn">-->
<!--        <el-icon class="closeBtn" :size="20" @click="handleClose">-->
<!--          <CloseBold/>-->
<!--        </el-icon>-->
<!--      </div>-->

    </div>
  </div>
</template>

<script setup lang="ts">

import {ref, toRef} from "vue";

const emit = defineEmits(['handleClick', 'handleClose'])
const props = defineProps({
  id: {
    type: String,
    default: '1'
  },
  title: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

const isActive = toRef(props, 'isActive')

const handleClick = () => {
  console.log(props.id)
  emit('handleClick', props.id)
}
const handleClose = () => {
  emit('handleClose', props.id)
}


</script>

<style scoped lang="less">
.tabBox {
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-content: center;
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  margin-right: 10px;
  flex-wrap: wrap;

  .title {
    padding: 0 10px;
    box-sizing: border-box;
    font-size: 20px;
    color: #000;
    cursor:pointer;
  }
  // hover
  .title:hover {
    color: #0fa37f ;
  }

  .closeBtn {
    cursor: pointer;
    height: 28px;
  }
  .closeBtn:hover{
    color: red;
  }
}

.active {
  border-top: 1px solid #0fa37f;
  border-left: 1px solid #0fa37f;
  border-right: 1px solid #0fa37f;
}

.active .title {
  color: #0fa37f;
}

.chatBox{
  width: 100%;
  height: 100%;
  background: red;
}
</style>