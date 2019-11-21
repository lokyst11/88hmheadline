<template>
  <div>
  <el-row>
      <el-col :span="10">
        <el-form ref="form" :model="user" label-width="80px">
        <el-form-item label="用户头像">
        </el-form-item>
        <el-form-item label="用户昵称">
            <el-input v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item label="个人介绍">
            <el-input v-model="user.intro"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱">
            <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
            <el-input disabled v-model="user.mobile"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">保存修改</el-button>
            <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :offset="1" :span="5">
      <!-- :http-request：自定义上传头像的请求行为 -->
      <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :http-request="onUpload"
          >
          <img v-if="user.photo" width="100" :src="user.photo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <p>点击选择上传用户头像</p>
      </el-upload>
    </el-col>
  </el-row>
  </div>
</template>

<script>
import eventBus from '../../utils/event-bus'
export default {
  name: 'AccountIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        email: '', // 邮箱
        intro: '', // 简介
        mobile: '', // 手机号
        name: '', // 昵称
        photo: ''// 头像
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
  },
  methods: {
    onSubmit () {
      // const name=this.user.name
      // const email=this.user.email
      // const intro=this.user.intro
      const { name, email, intro } = this.user
      console.log('保存')
      this.$axios({
        method: 'PATCH',
        url: '/user/profile',
        data: {
        // name: name,
        // email: email,
        // intro: intro
          name,
          email,
          intro
        }
      }).then(res => {
        eventBus.$emit('abc', this.user)
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('修改失败')
      })
    },
    loadUserProfile () {
      this.$axios({
        method: 'GET',
        url: '/user/profile'
      }).then(res => {
        console.log(res)
        this.user = res.data.data
      }).catch(err => {
        console.log(err)
        this.$message.error('获取失败')
      })
    },
    // file:回调函数中接收到的一个参数，一个上传文件的配置对象
    onUpload (config) {
      const fd = new FormData()
      fd.append('photo', config.file)
      this.$axios({
        method: 'PATCH',
        url: '/user/photo',
        data: fd
      }).then(res => {
        // 更新图片地址
        this.user.photo = res.data.data.photo
        // 同步头像
        eventBus.$emit('abc', this.user)
      }).catch(err => {
        console.log(err)
        this.$message.error('上传失败')
      })
    }
  }
}
</script>

<style>

</style>
