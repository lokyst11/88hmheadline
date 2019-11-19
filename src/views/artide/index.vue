<template>
 <div class="artide">
   <!-- 筛选数据 -->
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>全部图文</span>
    </div>
    <!-- 卡片内容 -->
    <el-form ref="form" :model="filterForm" label-width="80px">
    <el-form-item label="文章状态">
      <el-radio-group v-model="filterForm.status">
        <el-radio :label="null">全部</el-radio>
        <el-radio label="0">草稿</el-radio>
        <el-radio label="1">待审核</el-radio>
        <el-radio label="2">审核通过</el-radio>
        <el-radio label="3">审核失败</el-radio>
        <el-radio label="4">已删除</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="频道列表">
      <el-select placeholder="请选择频道" v-model="filterForm.channel_id">
        <el-option label="所有频道" :value="null"></el-option>
        <!-- 变量加： -->
        <el-option
        :label="channel.name"
        :value="channel.id"
        v-for="channel in channels"
        :key="channel.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="时间选择">
      <el-date-picker
        v-model="rangeDate"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd">
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="loadArticles(1)">立即查询</el-button>
    </el-form-item>
    </el-form>
</el-card>

<!-- 文章列表 -->
 <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{totalCount}}条符合条件的内容</span>
      </div>
      <!--
        el-table 表格组件
        data 表格的数组，要求是数组
        表格组件会使用 data 数据，在内部自己进行遍历，我们不需要自己写什么 v-for
        你只需要告诉这个表格组件：
          data 是啥
          表头名是什么
          列值是什么
        el-table-column 表格列组件
          prop 用来指定渲染哪个数据字段
          label 表头名称
          width 列宽

        表格列默认只能渲染普通文本，如果想要渲染点儿别的东西，需要自定义表格列。
       -->
      <el-table
        :data="articles"
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          prop="date"
          label="封面"
          width="180">
          <!--
            自定义表格列
            在 template 上声明 slot-scope="scope" ，然后就可以通过 scope.row 获取遍历项
            scope.row 就相当于我们自己 v-for 的 item

            注意：只有当你需要在自定义表格列模板中访问遍历项的时候才这么做
           -->
          <template slot-scope="scope">
            <img width="50" :src="scope.row.cover.images[0]">
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <el-tag
              :type="articleStatus[scope.row.status].type"
            >{{ articleStatus[scope.row.status].label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布日期">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button type="danger" @click="onDelete(scope.row.id)">删除</el-button>
            <el-button type="primary" @click="$router.push('/publish/' + scope.row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
</el-card>

<!-- 分页 -->
<!-- 默认按照10条每页划分页码
background：背景颜色
pager：页码
total：总数-->
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

  name: 'articles',
  data () {
    return {
    // 过滤数据
      filterForm: {
        status: null,
        channel_id: null
        // begin_pubdate: '',
        // end_pubdate: ''
      },
      rangeDate: '', // 日期范围
      articles: [], // 文章数据列表
      articleStatus: [
        {
          type: '',
          value: 0,
          lable: '草稿'
        }, {
          type: 'warning',
          value: 1,
          lable: '待审核'
        }, {
          type: 'success',
          value: 2,
          lable: '审核通过'
        }, {
          type: 'danger',
          value: 3,
          lable: '审核失败'
        }, {
          type: 'info',
          value: 4,
          lable: '已删除'
        }
      ],
      totalCount: 0, // 总记录数
      loading: true, // 表格的loading状态
      channels: [], // 频道列表
      page: 1
    }
  },

  created () {
    console.log('article created')
    // 初始化时加载第一页数据
    this.loadArticles(1)
    // 加载频道列表
    this.loadChannels()
  },
  methods: {
    loadArticles (page = 1) {
      this.loading = true
      // 在我们的项目中除了登录的接口不需要token，其他所有的接口都需要提供token，否者返回401错误
      // const token = window.localStorage.getItem('user-token')
      this.$axios({
        method: 'GET',
        url: '/articles',
        // headers: {
        // // 添加请求头
        // // 名字：后端要求把token放在请求头中使用，我们不能瞎写
        // // 注意格式要求Bearer后有个空格 用户token
        //   Authorization: `Bearer ${token}`
        // },
        params: {
          page,
          per_page: 10, // 默认10条每页
          // status: null
          status: this.filterForm.status,
          channel_id: this.filterForm.channel_id,
          begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始时间
          end_pubdate: this.rangeDate ? this.rangeDate[1] : null// 结束时间
        }
      }).then(res => { // 成功
        console.log(res)
        // 更新文章列表数组
        this.articles = res.data.data.results
        // 更新总记录数
        this.totalCount = res.data.data.total_count
      }).catch(err => { // 失败
        console.log(err, '获取数据失败')
      }).finally(() => {
        // 无论成功失败最终都要执行
        this.loading = false
      })
    },
    onPageChange (page) {
      this.page = page
      this.loadArticles(page)
    },
    loadChannels () {
      this.$axios({
        mathod: 'GET',
        url: '/channels'
      }).then(res => {
        this.channels = res.data.data.channels
      }).catch(err => {
        console.log(err, '获取失败')
      })
    },
    onDelete (articleId) {
      this.$axios({
        method: 'DELETE',
        //  /mp/v1_0/articles/:target target为id，冒号不能写
        url: `/articles/${articleId}`
        // headers: {
        //   Authorization: `Bearer ${window.localStorage.getItem('user-token')}` }
      }).then(res => {
        this.loadArticles(1)
      }).catch(err => {
        console.log(err, '删除失败')
      })
    }
  }
}
</script>

<style>

</style>
