import { createRouter, createWebHistory } from 'vue-router';
import AppLogin from '@/components/AppLogin.vue';
import AppDashboard from '@/components/AppDashboard.vue';
import AdBoard from '@/components/AdBoard.vue';
import AppRegister from '@/components/AppRegister.vue';
<<<<<<< HEAD
=======
import UserManagement from '@/components/UserManagement.vue'; // 假设存在用户管理组件
import { useStore } from 'vuex';
>>>>>>> 26cae8b (权限控制)

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
<<<<<<< HEAD
    component: AdBoard
=======
    component: AdBoard,
    meta: { requiresAuth: true }
>>>>>>> 26cae8b (权限控制)
  },
  {
    path: '/register',
    name: 'AppRegister',
    component: AppRegister
<<<<<<< HEAD
=======
  },
  {
    path: '/user-management',
    name: 'UserManagement',
    component: UserManagement,
    meta: { requiresAuth: true, requiredRole: 'admin' }
>>>>>>> 26cae8b (权限控制)
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
<<<<<<< HEAD
  const token = localStorage.getItem('token');
=======
  const store = useStore();
  const token = localStorage.getItem('token');
  const userRole = store.state.userRole;

  console.log('当前访问路由:', to.path);
  console.log('当前用户角色:', userRole);
  console.log('是否有令牌:', !!token);

>>>>>>> 26cae8b (权限控制)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 如果路由需要身份验证
    if (!token) {
      // 没有令牌，重定向到登录页面
      next({ name: 'AppLogin' });
<<<<<<< HEAD
=======
    } else if (to.meta.requiredRole && userRole !== to.meta.requiredRole) {
      console.log('角色不符，无权限访问');
      alert('您没有权限访问该页面');
      next({ name: 'AppDashboard' });
>>>>>>> 26cae8b (权限控制)
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
