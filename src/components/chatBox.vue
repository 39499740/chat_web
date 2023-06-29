<template>

  <div class="chat_content">
    <div class="chatArea resizeable" ref="msgBox">
      <MessageBox v-for="(msg,index) in openaiStore.messages.filter(item => item.role !== 'system')" :message="msg"
                  :key="msg.content+msg.role"/>
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
      <div class="bottomArea">
        <div>
          <el-button type="danger" @click="handleReset" :disabled="globalStore.getSk == ''">重新开始会话</el-button>
          <el-button type="info" @click="handleHistory">查看会话列表</el-button>
        </div>
        <el-button type="primary" @click="handleSend" :disabled="!enableInput"
        >发送(Ctrl+Enter)
        </el-button>
      </div>
    </div>
    <el-drawer v-model="showHistory" direction="rtl" :show-close="false" title="历史会话">

      <div class="historyDrawer">
        <div v-for="(conv,index) in conversations" :key="conv.id" @click="changeConv(index)"
             :class="{conv:true,selected:openaiStore.activeId == conv.conversationId,dark:index%2!=0}">
          <span style="max-lines: 2;flex: 1">{{ conv.title }}</span>
          <div style="cursor: pointer;" @click="deleteConv(conv.conversationId)">x</div>
        </div>
      </div>
    </el-drawer>
  </div>

</template>

<script setup lang="ts">

import {onMounted, ref, watch} from "vue";
import MessageBox from "./messageBox.vue";

import {ChatCompletionRequestMessage} from "openai";
import {useOpenAIStore} from "../store/openai";
import {useGlobalStore} from "../store";
import {ElMessage} from "element-plus";
import {ConversationDBEntity, db} from "../utils/db";

const openaiStore = useOpenAIStore()
const msgBox = ref<any>(null);


const showHistory = ref(false)
// 会话列表
const conversations = ref<ConversationDBEntity[]>([])

const props = defineProps({
  id: {
    type: String,
    default: '1'
  },
})

const inputText = ref('')

const handleLineBreak = (event: any) => {
  // 在光标位置插入换行符
  const input = event.target;
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const value = inputText.value;
  inputText.value = value.substring(0, start) + '\n' + value.substring(end);

}

onMounted(() => {
  watch(() => openaiStore.getMessages, (val) => {

    setTimeout(() => {
      msgBox.value!.scrollTop = msgBox.value!.scrollHeight;
    }, 20);
    if (openaiStore.getMessages.length > 1 && openaiStore.getMessages.length % 2 === 0) {
      enableInput.value = true
    }
  }, {
    immediate: true,
    deep: true
  })
})


const enableInput = ref(false)

const globalStore = useGlobalStore()

const handleSend = (evt: any) => {
  let target = evt.target;
  if (target.nodeName == "SPAN") {
    target = evt.target.parentNode;
  }
  target.blur();
  if (globalStore.sk == '') {
    globalStore.showFriends = true;
    ElMessage.error('清先设置 Openai Key')
    return
  }
  if (inputText.value.replaceAll(" ", "") !== "") {
    openaiStore.sendMessage(inputText.value)
    enableInput.value = false
    inputText.value = ''
  }
}

const handleReset = (evt: any) => {
  let target = evt.target;
  if (target.nodeName == "SPAN") {
    target = evt.target.parentNode;
  }
  target.blur();
  enableInput.value = false
  inputText.value = ''
  openaiStore.setupOpenAI(globalStore.sk)
}

const handleHistory = (evt: any) => {
  let target = evt.target;
  if (target.nodeName == "SPAN") {
    target = evt.target.parentNode;
  }
  target.blur();

  db.conversationDB.toArray().then((res: any) => {
    conversations.value = res
  })
  showHistory.value = true

}

const changeConv = (index: number) => {
  openaiStore.changeConv(conversations.value[index].conversationId)
  showHistory.value = false
}

const deleteConv = (conversationId: string) => {
  db.conversationDB.where('conversationId').equals(conversationId).delete().then(() => {
    db.conversationDB.toArray().then((res: any) => {
      conversations.value = res
      if (conversations.value.length > 0) {
        if (openaiStore.activeId == conversationId) {
          openaiStore.changeConv(conversations.value[0].conversationId)
        }
      } else {
        enableInput.value = false
        inputText.value = ''
        openaiStore.setupOpenAI(globalStore.sk)
      }
    })
    db.messageDB.where('conversationId').equals(conversationId).delete()


  })
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
    overflow-y: scroll;
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

.historyDrawer {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .conv {
    height: 60px;
    padding: 10px 10px;
    width: 100%;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-content: flex-start;
  }

  .selected {
    border: 1px solid #28a37f;
  }

  .dark {
    background: #efefef;
  }
}
</style>