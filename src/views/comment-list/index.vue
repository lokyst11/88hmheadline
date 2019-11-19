<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>评论详细列表</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>

      <el-table
        :data="comments"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="头像"
          width="180">
          <template slot-scope="scope">
            <img width="50px" :src="scope.row.aut_photo" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="评论内容"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="点赞"
          width="180">
          <template slot-scope="scope">
            {{ scope.row.is_liking === 1 ? '已赞' : '未赞'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="like_count"
          label="点赞数量"
          width="180">
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="评论日期"
          width="180">
          <template slot-scope="scope">
            <!-- 调用过滤器的语法  数据 | 过滤器函数 -->
            {{ scope.row.pubdate | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="是否推荐"
          width="180">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_top"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onTop(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="reply_count"
          label="回复数量"
          width="180">
        </el-table-column>
    </el-table>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'CommentList',
  components: {},
  // 另一种获取路由参数的方式
  props: {
    articleId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      comments: []
    }
  },
  computed: {},
  watch: {},
  // 实例选项过滤器
  // 过滤器函数
  // 局部过滤器
  // filters: {
  //   dateFormat (value) {
  //     console.log('dateFormat 被调用')
  //     return moment(value).format('YYY-MM-DD')
  //   }
  // },
  created () {
    this.loadComments()
  },
  methods: {
    loadComments () {
      this.$axios({
        method: 'GET',
        url: '/comments',
        params: {
          type: 'a', // 评论类型
          // 获取路由参数的方式
          source: this.articleId// 文章id
        }
      }).then(res => {
        console.log(res)
        const comments = res.data.data.results
        comments.forEach(item => {
          // moment(指定时间)，format(格式)
          item.pubdate = moment(item.pubdate).format('YYYY-MM-DD HH:mm:ss')
          // 年月日时分秒
        })
        // 将处理后的数据更新
        this.comments = comments
      }).catch(err => {
        console.log(err)
        this.$message.error('失败')
      })
    },
    onTop (comment) {
      this.$axios({
        method: 'PUT',
        url: `/comments/${comment.com_id}/sticky`,
        data: {
          sticky: comment.is_top
        }
      }).then(res => {
        this.$message('操作成功')
      }).catch(err => {
        this.$message.error('失败', err)
      })
    }
  }
}
</script>

<style>

</style>
