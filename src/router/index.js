import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '../views/layout'
import Login from '../views/login'
import homePage from '../views/homepage/index.vue'
import publish from '../views/publish/index.vue'
import artide from '../views/artide/index.vue'
import NProgress from 'nprogress'
import Comment from '../views/comment/index.vue'
import CommentList from '../views/comment-list/index.vue'
import Media from '../views/media/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout'
  },
  {
    path: '/layout',
    component: layout,
    children: [
      {
        path: '',
        component: homePage // 默认子路由
      },
      {
        path: '/publish',
        component: publish
      },
      {
        path: '/artide',
        component: artide
      },
      {
        path: '/publish/:articleId',
        component: publish
      },
      {
        path: '/Comment',
        component: Comment
      },
      {
        path: '/comment/:articleId',
        component: CommentList,
        // 将路由参数映射给组件props数据
        props: true
      },
      {
        path: '/Media',
        component: Media
      }
    ]
  },

  {
    path: '/login',
    component: Login
  }, {
    path: '/life',
    component: () => import('../views/life/index.vue')
  }]

const router = new VueRouter({
  routes
})
// 路由拦截器
// to:去哪里的路由信息
// from：来自哪里的路由信息
// next：他是一个方法，用于路由的放行
// 判断用户的登录状态，有就通过
router.beforeEach((to, from, next) => {
  NProgress.start()
  // 1.访问登录页直接通过
  if (to.path === '/login') {
    next()

    return
  }

  // 2.非登录页
  // 2.1获取用户token
  const token = window.localStorage.getItem('user-token')
  // 2.2判断是否有token
  if (token) {
    next()
  } else {
    // 2.3没有，跳到登录页
    next('/login')

    // 如果在非登陆状态下，这里就是手动终止进度条，否者进度条不会停止
    NProgress.done()
  }
})

router.afterEach((to, from) => {
  console.log('afterEach 导航完成')
  NProgress.done()
})

export default router
