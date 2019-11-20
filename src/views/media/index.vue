<template>
  <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>素材管理</span>

            <!-- action:上传文件的请求地址
            on-preview：上传预览事件
            on-remove：删除事件
            这个上传组件能帮我们自动发送请求，我们只需要配置参数
            上传组件内部会自己发送请求
            默认POST请求方法
            手动配置请求头
             -->
            <el-upload
              style="float: right; padding: 3px 0"
              class="upload-demo"
              action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
              :headers="uploadHeaders"
              name="image"
              :on-success="onUploadSuccess"
              :show-file-list="false"
              >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
        </div>
        <div>
            <el-radio-group v-model="type" @change="onFind">
            <el-radio-button label="全部"></el-radio-button>
            <el-radio-button label="收藏"></el-radio-button>
            </el-radio-group>
        </div>
        <!-- el-row：行
            gutter：间隔距离
         el-col：列
            span：指定列数-->
        <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="4" v-for="item in images" :key="item.id" class="col-item">
                <el-card :body-style="{ padding: '0px' }">
                    <img :src="item.url" class="image" height="200px">
                    <div style="padding: 14px;" class="action">
                        <i :class="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
                        @click="onCollect(item)"></i>
                        <i class="el-icon-delete-solid" @click="onDelete(item)"></i>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
  </div>
</template>

<script>
const token = window.localStorage.getItem('user-token')
export default {
  name: 'MediaIndex',
  data () {
    return {
      images: [],
      type: '全部',
      // 给上传组件使用的请求头
      uploadHeaders: {
        Authorization: `Bearer ${token}`
      }
    }
  },
  created () {
    this.loadImages()
  },
  methods: {
    loadImages (isCollect = false) {
      this.$axios({
        method: 'GET',
        url: '/user/images',
        params: {
          collect: isCollect
        }
      }).then(res => {
        console.log(res)
        this.images = res.data.data.results
      }).catch(err => {
        console.log(err)
      })
    },
    // 该事件函数有个回调参数 Radio label 值，我们可以声明一个形参来接收使用
    onFind (value) {
      console.log(value)
      this.loadImages(value !== '全部')
    },
    // 取消收藏
    onCollect (item) {
      console.log(item)
      this.$axios({
        method: 'PUT',
        url: `/user/images/${item.id}`,
        data: {
          collect: !item.is_collect
        }
      }).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        // 更新视图
        item.is_collected = !item.is_collected
      }).catch(err => {
        console.log(err)
        this.$message.error('操作失败')
      })
    },

    // 删除图片
    onDelete (item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定执行
        this.$axios({
          method: 'DELETE',
          url: `/user/images/${item.id}`
        }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })

          // 更新列表
          this.loadImages(this.type !== '全部')
        }).catch(err => {
          console.log(err)
          this.$message.error('删除失败')
        })
      }).catch(() => {
        // 取消执行
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // upload组件上传成功触发事件
    onUploadSuccess () {
      // 刷新图片列表
      this.loadImages(this.type !== '全部')
    }
  }
}
</script>

<style lang="less" scoped>
.col-item{
    margin-bottom: 20px;
    .action{
        display: flex;
        justify-content: center;
        font-size: 24px;
    }
}
</style>
