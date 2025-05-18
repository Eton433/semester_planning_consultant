import { createRouter, createWebHistory } from 'vue-router'

import StudentCoursePlanner from '../components/StudentCoursePlanner.vue'
import AbilityManager from '../components/AbilityManager.vue'
import Dashboard from '../components/Dashboard.vue'
import StudentClubPage from '../components/StudentClubPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/student',
    component: StudentCoursePlanner
  },
  {
    path: '/abilities',
    component: AbilityManager
  },
  {
    path: '/dashboard',
    component: Dashboard
  },
  {
    path: '/clubs', // ✅ 正確設定為 /clubs
    component: StudentClubPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
