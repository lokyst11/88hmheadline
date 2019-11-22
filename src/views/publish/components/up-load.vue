<template>
  <div class="upload-image">
      <div class="preview" @click="onUploadShow">
      <!-- <img src="" class="avatar"> -->
      <i class="el-icon-plus avatar-uploader-icon"></i>
      </div>
      <el-dialog
        title="请选择文章封面图片"
        :visible.sync="centerDialogVisible"
        width="50%"
        center>
        <!-- 标签导航 -->
        <!-- el-tabs：双向绑定 -->
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="素材库" name="first">
                <el-radio-group v-model="activeImage" @change="loadImages">
                    <el-radio label="all">全部</el-radio>
                    <el-radio label="collect">收藏</el-radio>
                </el-radio-group>
                <el-row :gutter="20">
                    <el-col :span="6" v-for="item in images" :key="item.id">
                        <img height="100" :src="item.url">
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="上传图片" name="second">配置管理</el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
        </span>
       </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UploadImage',
  components: {},
  props: {},
  data () {
    return {
      // 对话框显示或隐藏
      centerDialogVisible: false,
      activeName: 'first', // 激活的标签页
      activeImage: 'all', // 激活的图片筛选类型
      images: []
    }
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    onUploadShow () {
      // 请求加载数据
      this.loadImages()
      //   显示弹窗
      this.centerDialogVisible = true
    },
    loadImages () {
      // 接口
      this.$axios({
        method: 'GET',
        url: '/user/images',
        params: {
          // 获取收藏图片，双向绑定radio选择框
          collect: this.activeImage === 'collect'
        }
      }).then(res => {
        this.images = res.data.data.results
      }).catch(() => {

      })
    }
  }
}
</script>

<style scoped>
.upload-image {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    /* 光标：指针 */
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.upload-image .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
