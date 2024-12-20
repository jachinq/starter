import Vue from 'vue'
import App from './App.vue'
import Resource from 'vue-resource'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import Bus from './bus'; // 引入全局事件总线

Vue.config.productionTip = false;
Vue.prototype.$bus = Bus;

Vue.use(Resource); // 使用 Resource
Vue.use(ElementUI);

try {
    new Vue({
        render: (h) => h(App),
    }).$mount('#app');
} catch (e) {
    console.log(e);
}
