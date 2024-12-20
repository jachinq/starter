import Vue from 'vue'
import Popup from './popup/Popup.vue';

try {
  new Vue({
      render: (h) => h(Popup),
  }).$mount('#popup-app');
} catch (e) {
  console.error(e);
}