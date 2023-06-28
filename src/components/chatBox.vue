<template>

  <div class="chat_content">
    <div class="chatArea resizeable" ref="msgBox">
       <MessageBox  v-for="(msg,index) in openaiStore.messages.filter(item => item.role !== 'system')" :message="msg" :key="index"/>
    </div>
    <div class="inputArea">
      <el-input
          v-model="inputText"
          class="inputField"
          type="textarea"
          :placeholder="enableInput ? '请输入内容' : '请等待对方回复'"
          :autosize="true"
          resize="none"
          @keydown.ctrl.enter="handleSend"
          :disabled="!enableInput"
      />
      <div class="bottomArea" >
        <div>
          <el-button type="danger" @click="handleReset" disabled>重新开始会话</el-button>
          <el-button type="info" @click="handleHistory" disabled>查看历史记录</el-button>
        </div>
        <el-button type="primary" @click="handleSend">发送(Ctrl+Enter)</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {onMounted, ref, watch} from "vue";
import MessageBox from "./messageBox.vue";

import {ChatCompletionRequestMessage} from "openai";
import {useOpenAIStore} from "../store/openai";
import {useGlobalStore} from "../store";
import {ElMessage} from "element-plus";

const openaiStore = useOpenAIStore()
const msgBox = ref<any>(null);

const props = defineProps({
  id: {
    type: String,
    default: '1'
  },
})

const inputText = ref('')

const handleLineBreak = (event:any)=> {
  // 在光标位置插入换行符
  const input = event.target;
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const value = inputText.value;
  inputText.value = value.substring(0, start) + '\n' + value.substring(end);

}

onMounted(() => {
  watch(()=>openaiStore.getMessages, (val) => {

    setTimeout(() => {
      msgBox.value!.scrollTop = msgBox.value!.scrollHeight;
    }, 20);
    if (openaiStore.getMessages.length > 1 && openaiStore.getMessages.length % 2 === 0) {
      enableInput.value = true
    }
  },{
    immediate: true,
    deep: true
  })
})



const enableInput = ref(false)

const globalStore = useGlobalStore()

const handleSend = () => {
  if (globalStore.sk == ''){
    globalStore.showFriends = true;
    ElMessage.error('清先设置 Openai Key')
    return
  }
  openaiStore.sendMessage(inputText.value)
  enableInput.value = false
  inputText.value = ''
}

const handleReset = () => {
  console.log('handleReset')
}

const handleHistory = () => {
  console.log('handleHistory')
}

</script>

<style scoped lang="less">
.chat_content {
  width: 100%;
  height: calc(100vh - 44px);
  display: flex;
  flex-direction: column;


  .chatArea {
    min-height: 30%;
    overflow-y:scroll;
    height: 80%;
  }

  .inputArea {
    flex: 1;
    min-height: 150px;
    border-top: 1px solid red;
    display: flex;
    flex-direction: column;
    padding: 5px;
    box-sizing: border-box;

    .inputField {
      height: 100%;

      :deep(.el-textarea__inner) {
        height: 100% !important;

      }
    }

    .bottomArea {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 10px;
    }

  }

  .resizeable {
    resize: vertical;
    overflow: auto;
  }
}

</style>