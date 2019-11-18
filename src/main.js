import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '../src/styles/index.less'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import JSONbig from 'json-bigint'
import 'nprogress/nprogress.css'

// 设置axios常态地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'

axios.defaults.transformResponse = [function (data, headers) {
  // Do whatever you want to transform the data
  try {
    return JSONbig.parse(data)
  } catch (err) {
    return {}
  }
}]
Vue.prototype.$axios = axios // 共享给所有的实例使用

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
