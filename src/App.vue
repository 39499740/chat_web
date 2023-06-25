<template>
  <div id="app">
    <HomePage class="home"/>
  </div>
</template>
<script setup lang="ts">
import HomePage from './pages/home.vue'
import {useOpenAIStore} from "./store/openai.ts";
import {onMounted} from "vue";
import {useGlobalStore} from "./store";
const openaiStore = useOpenAIStore()
const globalStore = useGlobalStore()
onMounted(() => {
  if(globalStore.sk != "") {
    openaiStore.setupOpenAI(globalStore.sk)
  }
})

</script>

<style lang="less">
#app {
  height: 100vh;
  width: 100vw;

}

.home {
  height: 100%;
  width: 100%;
  display: block;
}


</style>