<template>
  <div class="upload-image">
      <div class="preview" @click="onUploadShow">
          <!-- 有图片显示图片没有显示加号 -->
      <img v-if="value" :src="value" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </div>
      <el-dialog
        title="请选择文章封面图片"
        :visible.sync="centerDialogVisible"
        width="50%"
        center>
        <!-- 标签导航 -->
        <!-- el-tabs：双向绑定 -->
          <el-tabs v-model="activeName">
            <el-tab-pane label="素材库" name="first">
                <el-radio-group v-model="activeImage" @change="loadImages">
                    <el-radio label="all">全部</el-radio>
                    <el-radio label="collect">收藏</el-radio>
                </el-radio-group>
                <el-row :gutter="20">
                    <el-col :class="{'img-item':index===activeIndex}" :span="6"
                    v-for="(item,index) in images" :key="item.id" @click.native="activeIndex=index">
                        <img height="100" :src="item.url">
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="上传图片" name="second">
              <el-upload
                action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
                :headers="uploadHeaders"
                name="image"
                list-type="picture-card"
                :on-preview="onPreview">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onConfirm">确 定</el-button>
        </span>
       </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UploadImage',
  components: {},
  props: {
    value: {
      // 选择预览的图片地址
      type: String
    }
  },
  data () {
    const token = window.localStorage.getItem('user-token')
    return {
      // 对话框显示或隐藏
      centerDialogVisible: false,
      activeName: 'first', // 激活的标签页
      activeImage: 'all', // 激活的图片筛选类型
      images: [],
      activeIndex: null,
      uploadHeaders: {
        Authorization: `Bearer ${token}`
      },
      previewImage: ''
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
    },
    // 对话框确定时
    onConfirm () {
      if (this.activeName === 'first') {
        const image = this.images[this.activeIndex]
        if (image) {
        //   将选中的图片赋值给previewImage
        // this.previewImage = image.url
        // 同步给父组件绑定的数据
          this.$emit('input', image.url)
        }
      } else if (this.activeName === 'second') {
        const previewImage = this.previewImage
        if (previewImage) {
          this.$emit('input', previewImage)
        }
      }
      //   关闭对话框
      this.centerDialogVisible = false
    },
    onPreview (file) {
      // console.log(file)
      this.previewImage = file.response.data.url
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
.img-item{
    border: 1px solid #000;
}
</style>
