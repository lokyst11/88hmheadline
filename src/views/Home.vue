<template>
 <!-- 布局 -->
 <el-container>
   <!-- 左右布局 -->
   <el-aside>左侧</el-aside>
   <!-- 大容器包含头部和中间 -->
   <el-container>
     <el-header>头部</el-header>
     <el-main>中间
       <!-- 二级路由容器 -->
       <router-view></router-view>
     </el-main>
   </el-container>
 </el-container>
</template>

<script>
export default {
  name: 'home',
  components: {
  }
}
</script>
