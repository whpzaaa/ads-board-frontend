<template>
  <div>
    <h2>登录</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="loginDTO.username" type="text" placeholder="用户名" required>
      <input v-model="loginDTO.password" type="password" placeholder="密码" required>
      <button type="submit">登录</button>
    </form>
    <p>还没有账号？<router-link to="/register">注册</router-link></p>
  </div>
</template>

<script>
import api from '@/api';
<<<<<<< HEAD
=======
import { parseJwt } from '@/utils/jwtUtils';
import { useStore } from 'vuex';
>>>>>>> 26cae8b (权限控制)

export default {
  name: 'AppLogin',
  data() {
    return {
      loginDTO: {
        username: '',
        password: ''
      }
    };
  },
<<<<<<< HEAD
=======
  setup() {
    const store = useStore();
    return {
      store
    };
  },
>>>>>>> 26cae8b (权限控制)
  methods: {
    async handleLogin() {
      try {
        const response = await api.post('/api/users/login', this.loginDTO);
        if (response) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.userName);
          localStorage.setItem('userId', response.id);
<<<<<<< HEAD
=======

          // 解析 JWT 令牌并保存用户角色
          const decodedToken = parseJwt(response.token);
          this.store.dispatch('setUserRole', decodedToken.userRole);

>>>>>>> 26cae8b (权限控制)
          this.$router.push({ name: 'AppDashboard' });
        } else {
          alert('登录失败，请检查用户名和密码');
        }
      } catch (error) {
        console.error('登录出错:', error);
        alert('登录出错，请稍后重试');
      }
    }
  }
};
</script>
