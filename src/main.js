import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css';
import router from './router'
import store from './store';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import axios from 'axios';
Vue.config.productionTip = false
Vue.use(Toast);

new Vue({
  axios,
  store,
  router,
  render: h => h(App),
}).$mount('#app')
