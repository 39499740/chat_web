<template>
  <div :class="{messageContent:true,user:isUser,assistant:!isUser}">
    <div class="icon">
      <el-icon size="35" v-if="isUser">
        <Avatar/>
      </el-icon>
      <img :src="openaiLogo" style="width: 35px;height: 35px" v-else/>

    </div>
    <div class="message">
      <div v-highlight v-html="article" id="content"></div>

    </div>
  </div>
</template>

<script setup lang="ts">

import openaiLogo from "../assets/openaiLogo.png";
import {marked} from "marked"
import {onMounted, ref} from "vue";
import {ChatCompletionRequestMessage} from "openai";

const props = defineProps({
  message: {
    type: ChatCompletionRequestMessage,
    default: {}
  }
})
const isUser = props.message.role === 'user'

const article = ref('')

onMounted(() => {
  article.value = marked(props.message.content)
})

</script>

<style scoped lang="less">
.messageContent {
  background: gray;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  .icon {
    background: white;
    padding: 5px;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-content: center;
    margin-right: 20px;
    flex-wrap: wrap;
  }

  .message {
    flex: 1;
    min-height: 50px;
    font-size: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: flex-start;
    width: 90%;
  }
}

.user {
  background: #f7f8fa;
}

.assistant {
  background: #f2f3f5;
}
</style>