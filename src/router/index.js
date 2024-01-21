// Composables
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: '番茄鐘 | 首頁'
    }
  },
  {
    path: '/list',
    component: () => import('@/views/ListView.vue'),
    meta: {
      title: '番茄鐘 | 事項'
    }
  },
  {
    path: '/settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: {
      title: '蕃茄鐘 | 設定'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

// 跳轉後跑這個function
router.afterEach((to, from) => {
  document.title = to.meta.title
})
export default router
