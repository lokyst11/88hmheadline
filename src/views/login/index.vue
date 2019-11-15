<template>
  <div class="login">
      <!-- 用组件 -->
      <el-card class="login-card">
          <!-- 卡片内容 -->
          <div class="title">
              <img src="../../img/logo_index.png" alt="">
          </div>
          <!-- 表单 :model表单数据 rules校验规则-->
          <el-form ref="formObj" style="margin-top:20px" :model="loginForm" :rules="loginRules">
              <!-- 一个表单就是一个form-item -->
              <el-form-item prop="mobile">
                  <!-- 表单组件 -->
                  <!-- 手机号 -->
                  <el-input v-model="loginForm.mobile" placeholder="请输入您的手机号"></el-input>
              </el-form-item>
              <el-form-item prop="code">
                  <!-- 验证码 -->
                  <el-input v-model="loginForm.code" style="width:280px" placeholder="请输入您的验证码"></el-input>
                   <el-button style="float:right" plain>发送验证码</el-button>
              </el-form-item>
              <el-form-item prop="checked">
                  <!-- 勾选框 -->
                   <el-checkbox v-model="loginForm.checked">我已阅读并同意用户协议及条款</el-checkbox>
              </el-form-item>
              <el-form-item>
                  <el-button style="width:100%" type="primary" @click="login">登录</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        mobile: '', // 手机号
        code: '', // 验证码
        checked: ''// 是否勾选
      },
      // 校验规则对象
      loginRules: {
        // key(要校验的字段名).value(数组，多条或者没有)
        // required:必填  pattern：正则表达式
        mobile: [{ required: true, message: '请输入您的手机号' }, { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' }],
        code: [{ required: true, message: '请输入您的验证码' }, { pattern: /^\d{6}$/, message: '请输入6位数字' }],
        checked: [{ validator: function (rule, value, callback) {
          // rule 代表当前规则
          // value 代表当前的值=>表单字段checked的值
          // callback回调函数
          if (value) {
            callback()// 表示直接通过
          } else {
            callback(new Error('请您勾选同意协议'))// 不通过也直接执行
          }
        } }
        ]
      }
    }
  },
  methods: {
    login () {
      // 手动校验
      this.$refs.formObj.validate((isOK) => {
        if (isOK) {
          // 如果为true执行下一步，不用写不成功
          this.$axios({
            url: '/authorizations',
            data: this.loginForm,
            method: 'post'
          }).then(result => {
            console.log(result)
            window.localStorage.setItem('user-token', result.data.data.token)
            this.$router.push('/layout')
          }).catch(() => {
            this.$message({
              type: 'warning',
              message: '手机号或验证码错误'
            })
          })
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.login {
     background-image: url('../../img/login_bg.jpg');
     background-size: cover;//自适应整个屏幕的宽高
     height: 100vh;
     display: flex;
     justify-content: center;
     align-items: center;
     .login-card {
         width: 440px;
         height: 340px;
         background-color: #fff;
         .title {
             text-align: center;
             img {
                 height: 45px;
             }
         }
     }
}
</style>
