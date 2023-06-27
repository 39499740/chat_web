import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from "pinia";
import {createPersistedState} from "pinia-plugin-persistedstate";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css' //样式


const store = createPinia();
store.use(createPersistedState({
    serializer: {//指定参数序列化器
        serialize: JSON.stringify,
        deserialize: JSON.parse,
    }
}));

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
//创建v-highlight全局指令
app.directive('highlight', function (el) {
    let blocks = el.querySelectorAll('pre code');
    blocks.forEach((block: any) => {
        hljs.highlightBlock(block)
    })
})


app.use(store)
app.use(ElementPlus)
app.mount('#app')