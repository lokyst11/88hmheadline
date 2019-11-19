<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
      <span>评论管理</span>
      </div>
      <el-table
        :data="articles"
        style="width: 100%">
          <el-table-column
          prop="title"
          label="标题"
          width="180">
          </el-table-column>
          <el-table-column
          prop="total_comment_count"
          label="总评论数">
        </el-table-column>
          <el-table-column
          prop="fans_comment_count"
          label="粉丝评论数">
        </el-table-column>
          <el-table-column
          label="评论状态"
          width="180">
          <template slot-scope="scope">
            <!-- 开关组件绑定数据是布尔值，true为开，false为关闭 -->
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onStatusChange(scope.row)">
            </el-switch>
          </template>
          </el-table-column>
          <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="$router.push('/comment/'+scope.row.id)">修改</el-button>
          </template>
        </el-table-column>
    </el-table>
   </el-card>

<!-- 分页 -->
   <el-pagination
    background
    layout="prev, pager, next"
    :total="totalCount"
    @current-change="onPageChange"
    :disabled="loading">
  </el-pagination>
</div>
</template>

<script>
export default {
  name: 'CommentIndex',
  components: {},
  props: {},
  data () {
    return {
      articles: [],
      totalCount: 0, // 总记录数
      loading: true, // 表格的loading状态
      page: 1
    }
  },
  computed: {},
  watch: {},
  created () {
    this.lodaArticles(1)
  },
  methods: {
    lodaArticles (page = 1) {
      this.loading = true
      this.$axios({
        method: 'GET',
        url: '/articles',
        params: {
          response_type: 'comment',
          page,
          per_page: 10 // 默认10条每页
        }
      }).then(res => {
        this.articles = res.data.data.results
        this.totalCount = res.data.data.total_count
      }).catch(err => {
        console.log(err, '失败')
      }).finally(() => {
        // 无论成功失败最终都要执行
        this.loading = false
      })
    },
    onStatusChange (article) {
      this.$axios({
        method: 'PUT',
        url: '/comments/status',
        params: {
          article_id: article.id.toString()
        },
        data: {
          // 开关组件双向绑定article.comment_status也就是在获取开关组件的启动状态
          allow_comment: article.comment_status
        }
      }).then(res => {
        console.log(res)
        this.$message({
          type: 'success',
          message: `${article.comment_status ? '启用' : '关闭'}成功`
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('失败')
      })
    },
    onPageChange (page) {
      this.page = page
      this.lodaArticles(page)
    }
  }
}
</script>

<style>

</style>
