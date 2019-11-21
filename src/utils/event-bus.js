import Vue from 'vue'

// 导出模块
export default new Vue()

// 1.通信方法：订阅：在通信的a端自定义一个事件eventBus.$on('自定义事件名称', () => {
// 业务逻辑代码
// })，通知
// 在通信的 b 端发布调用自定义事
// eventBus.$emit('事件名称'，如果有数据可以放在这里)
