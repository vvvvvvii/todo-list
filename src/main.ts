import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import CKEditor from '@ckeditor/ckeditor5-vue2'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

Vue.use(VueAxios, axios)
Vue.use(CKEditor)

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App)
}).$mount('#app')
