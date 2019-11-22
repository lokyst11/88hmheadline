<template>
  <div class="publish">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $route.params.articleId ? '编辑文章' : '发布文章'}}</span>
      </div>
      <!-- 内容 -->
      <el-form ref="form" :model="article" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
          <!-- bidirectional data binding（双向数据绑定） -->

          <!-- 富文本编辑器 -->
        <quill-editor v-model="article.content"
                ref="myQuillEditor"
                :options="editorOption">
        </quill-editor>
        </el-form-item>
      <el-form-item label="频道">
        <el-select placeholder="请选择频道" v-model="article.channel_id">
        <!-- 变量加： -->
        <el-option
        :label="channel.name"
        :value="channel.id"
        v-for="channel in channels"
        :key="channel.id">
        </el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <template v-if="article.cover.type > 0">
            <el-row :gutter="20">
              <el-col :span="4" v-for="(item,index) in article.cover.type" :key="item">
                <!-- 把选中的图片同步给数组的下标 -->
                <UploadImage v-model="article.cover.images[index]"></UploadImage>
              </el-col>
            </el-row>
          </template>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(false)">发表</el-button>
          <el-button @click="onSubmit(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 加载富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 加载富文本编辑器的核心组件
import { quillEditor } from 'vue-quill-editor'

// 1.加载
import UploadImage from './components/up-load'

export default {
  name: 'publishArticle',
  components: {
    // 注册局部组件
    quillEditor,
    UploadImage
  },
  data () {
    return {
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          type: 1, // 无图
          images: []// 无图就是空数组
        },
        channel_id: []
      },
      channels: [],
      editorOption: {} // 富文本编辑器选项
      // imageCount: 1
    }
  },
  created () {
    // console.log('publish created')
    // 添加和编辑都使用这组件
    this.loadChannels()
    if (this.$route.params.articleId) {
      this.loadArticle()
    }
  },
  methods: {
    loadArticle () {
      this.$axios({
        method: 'GET',
        url: `/articles/${this.$route.params.articleId}`
      }).then(res => {
        // console.log(res.data)
        this.article = res.data.data
      })
    },
    onSubmit (draft) {
      if (this.$route.params.articleId) {
        // 请求编辑文章
        this.updataArticle(draft)
      } else {
        // 请求添加文章
        this.addArticle(draft)
      }
    },
    addArticle (draft) {
      this.$axios({
        method: 'POST',
        url: '/articles',
        // headers: {
        //   Authorization: `Bearer ${window.localStorage.getItem('user-token')}`
        // },
        params: {
          draft
        },
        // 与article里面的参数一样，就可以这么写
        data: this.article
      }).then(res => {
        // console.log(res)
        this.$message({
          type: 'success',
          message: '更新成功'
        })
        // 更新成功后跳转页面
        this.$router.push('/artide')
      }).catch(() => {
        // console.log(err, '保存失败')/
        this.$message.error('更新失败')
      })
    },
    updataArticle (draft) {
      this.$axios({
        method: 'PUT',
        url: `/articles/${this.$route.params.articleId}`,
        // jQuery参数
        params: {
          draft
        },
        // body
        data: this.article
      }).then(res => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
      }).catch(() => {
        // console.log(err)
        this.$message.error('更新失败')
      })
    },
    loadChannels () {
      this.$axios({
        mathod: 'GET',
        url: '/channels'
      }).then(res => {
        this.channels = res.data.data.channels
      }).catch(() => {
        // console.log(err, '获取失败')
      })
    }
  }
}
</script>

<style>

</style>
