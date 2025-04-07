import { createRouter, createWebHistory } from 'vue-router';
import AppLogin from '@/components/AppLogin.vue';
import AppDashboard from '@/components/AppDashboard.vue';
import AdBoard from '@/components/AdBoard.vue';
import AppRegister from '@/components/AppRegister.vue';

const routes = [
  {
    path: '/',
    name: 'AppLogin',
    component: AppLogin
  },
  {
    path: '/dashboard',
    name: 'AppDashboard',
    component: AppDashboard,
    meta: { requiresAuth: true } // 添加元信息，标记该路由需要身份验证
  },
  {
    path: '/ad-board',
    name: 'AdBoard',
    component: AdBoard
  },
  {
    path: '/register',
    name: 'AppRegister',
    component: AppRegister
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 如果路由需要身份验证
    if (!token) {
      // 没有令牌，重定向到登录页面
      next({ name: 'AppLogin' });
    } else {
      // 有令牌，继续访问
      next();
    }
  } else {
    // 不需要身份验证的路由，直接访问
    next();
  }
});

export default router;
