import Vue from 'vue'
import Popup from './components/popup/Popup.vue';

const app = document.getElementById("popup-app");
console.log(app);
try {
  new Vue({
      render: (h) => h(Popup),
  }).$mount('#popup-app');
} catch (e) {
  console.error(e);
}
