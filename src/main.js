import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '../src/styles/index.less'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import JSONbig from 'json-bigint'
import moment from 'moment'
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

// axios请求拦截器
axios.interceptors.request.use(function (config) {
  console.log('请求拦截器', config)
  const token = window.localStorage.getItem('user-token')

  // 统一添加token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // config.headers.Authorization = `Bearer ${window.localStorage.getItem('user-token')}`
  // 通行的规则
  return config
}, function (error) {
  return Promise.reject(error)
})

// axios响应拦截器
axios.interceptors.response.use(function (response) {
  console.log('响应拦截器')
  return response
}, function (error) {
  return Promise.reject(error)
})
Vue.prototype.$axios = axios // 共享给所有的实例使用

Vue.use(ElementUI)

// 全局过滤器:处理一些简单的文本格式化
Vue.filter('dateFormat', value => {
  return moment(value).format('YYYY-MM-DD')
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
