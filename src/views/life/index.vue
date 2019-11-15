<template>
  <div>生命
      <p>{{name}}</p>
      <input type="text" v-model="name">
      <p>{{age}}</p>
      <input type="text" v-model="age">
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '张三',
      age: 18
    }
  },
  // 实例创建前后，多余之前没啥可干的
  beforeCreate () {
    console.log('实例创建之前执行')
  },
  // 执行创建实例，有用
  created () {
    // 都没有完成页面的渲染
    console.log('实例创建之后执行')
  },
  //   有用
  beforeMount () {
    // 依然没有完成页面的渲染
    console.log('页面渲染之后执行beforeMount')
  },
  //   有用
  mounted () {
    // 页面渲染完成 可以$ref，获取dom对象
    console.log('页面渲染后执行mounted')
  },
  // 数据更新前后,多余用Wacth替代
  beforeUpdate () {
    console.log('数据更新之前执行')
  },
  updated () {
    console.log('数据更新之后执行')
  },
  //   实例销毁事件，有用
  beforeDestroy () {
    //   要将之前定义的定时器销毁掉
    console.log('实例销毁之前执行')
  },
  destroyed () {
    console.log('实例销毁后执行')
  }
}
</script>

<style>

</style>
