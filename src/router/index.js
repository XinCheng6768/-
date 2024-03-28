import { getToken } from '@/utils/storage'
import { Message } from 'element-ui'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: "/",
      redirect:'/dashboard',
      component: () => import('@/views/layout/layout.vue'),
      children: [
        //二级路由没有斜杆是相对路由，直接拼接上父级路由
        {
          path: "/dashboard",
          component: () => import('@/views/dashboard/dashboard.vue'),
        }, {
          path: "/article",
          component: () => import('@/views/article/article.vue'),
        }
      ]
    },
    {
      path: "/login",
      component: () => import('@/views/login/login.vue')
    }
  ]
})
const whiteList = ['/login']
router.beforeEach((to,from,next)=>{
  const token = getToken()
  if(token || whiteList.includes(to.path)) return next()
  next('/login')
  Message.error('请您先登录哦')
})

export default router
