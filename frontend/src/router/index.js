import { createRouter, createWebHistory } from 'vue-router'
import Auth from '../components/Auth.vue'
import StudentCoursePlanner from '../components/StudentCoursePlanner.vue'
import AbilityManager from '../components/AbilityManager.vue'
import Dashboard from '../components/Dashboard.vue'
import StudentClubPage from '../components/StudentClubPage.vue'
import PerformanceInput from '../components/PerformanceInput.vue'
import TimePlanView from '../components/TimePlanView.vue';

const routes = [

  {
    path: '/',
    redirect: '/login'  // ← 這裡改成導向 login
  },
  {
    path: '/login',
    component: () => import('../components/Auth.vue')  // ← 確保這行有載入 Auth.vue
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
    path: '/clubs',
    component: StudentClubPage
  },
  { path: '/performance', 
    component: PerformanceInput },
    {
      path: '/timeplan',
      component: TimePlanView
    }
    
    
]






const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('student_id')

  if (to.path !== '/login' && !isAuthenticated) {
    next({ path: '/login', query: { reason: 'login_required' } })
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})


export default router
