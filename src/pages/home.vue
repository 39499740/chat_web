<template>
  <div class="content">
    <div class="titleArea">
      <div class="friends" @click="openDrawer">
        <el-icon :size="20" color="#0fa37f">
          <Expand/>
        </el-icon>
      </div>
      <div class="titleList">
        <ChatTab class="title" v-for="tab in tabs" :key="tab.id" :id="tab.id" :title="tab.name"
                 :isActive="tab.id==activeTab" @handleClick="tabClicked" @handleClose="tabClose"/>
      </div>
    </div>
    <ChatBox class="chatBox"/>
  </div>

  <el-drawer v-model="globalStore.showFriends" direction="ltr" :show-close="false" :with-header="false">
    <div class="leftDrawer">
      <div class="drawerContent">
        <span class="inputTitle">OpenAI Key</span>
        <el-input v-model="sk"/>
      </div>
      <div style="width: 100%;display: flex;flex-direction: row;justify-content: flex-end">
        <el-button class="saveBtn" type="success" @click="handleDrawerSave">保存</el-button>
      </div>

    </div>
  </el-drawer>


</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import ChatBox from "../components/chatBox.vue";
import Friends from "../components/friends.vue";
import {useGlobalStore} from "../store";
import {useOpenAIStore} from "../store/openai";
import ChatTab from "../components/chatTab.vue";

const activeTab = ref('1')
const sk = ref('')
const globalStore = useGlobalStore()
const openaiStore = useOpenAIStore()
onMounted(() => {
  sk.value = globalStore.getSk
})


const tabClose = (key: string) => {
  tabs.value = tabs.value.filter((tab) => tab.id !== key)

  if (activeTab.value == key) {
    if (tabs.value.length > 1) {
      activeTab.value = tabs.value[0].id
    }
  }
}
const tabClicked = (id: any) => {
  console.log("tabClicked", id)
  activeTab.value = id
}

interface chatTabs {
  name: string,
  id: string,
}

const tabs = ref<chatTabs[]>([
  {
    name: 'OpenAI',
    id: '1'
  },

])

const handleDrawerSave = () => {
  if (sk.value != '' && sk.value != globalStore.getSk) {
    globalStore.setSk(sk.value)
    openaiStore.setupOpenAI(sk.value)
  }
  globalStore.setSk(sk.value)
  globalStore.showFriends = false
}

const openDrawer = () => {
  sk.value = globalStore.getSk
  globalStore.showFriends = true

}


</script>


<style lang="less" scoped>
.content {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 2px;
  box-sizing: border-box;


  .titleArea {
    width: 100%;
    height: 44px;
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: space-between;
    border-bottom: 1px solid #ebeef5;
    overflow: hidden;

    .titleList {
      overflow-x: auto;
      flex: 1;
      display: flex;
      flex-direction: row;
      padding-top: 5px;
      box-sizing: border-box;

    }

    .titleList::-webkit-scrollbar {
      display: none;
    }

    .friends {
      width: 50px;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }


  .showFriendButton {
    position: absolute;
    left: 0;
    top: 45%;
    height: 45px;
    width: 15px;
    background-color: #ebeef5;
    line-height: 45px;
    color: #909399;
    text-align: center;
    cursor: pointer;
  }


}

.leftDrawer {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .drawerContent {
    display: flex;
    flex-direction: column;
    flex: 1;

    .inputTitle {
      line-height: 28px;
      margin: 5px 0;
    }
  }

  .saveBtn {
    width: 30%;
  }


  .chatBox{
    flex: 1;

    width: 100%;
    background: red;
  }
}

</style>
