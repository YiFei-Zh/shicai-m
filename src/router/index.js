import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/')
  },
  {
    path: '/',
    component: () => import('@/views/layout/'),
    children: [
      {
        path: '',//默认子路由
        name: 'home',
        component: () => import('@/views/home/')
      },
      {
        path: '/chat',
        name: 'chat',
        component: () => import('@/views/chat/')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/')
      },
      {
        path: '/shopping',
        name: 'shopping',
        component: () => import('@/views/shopping/')
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
