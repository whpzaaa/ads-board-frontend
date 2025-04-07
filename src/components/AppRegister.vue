<template>
  <div>
    <h2>注册</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="registerDTO.username" type="text" placeholder="用户名" required>
      <input v-model="registerDTO.password" type="password" placeholder="密码" required>
      <input v-model="registerDTO.email" type="email" placeholder="邮箱" required>
      <!-- 替换文本框为按钮选择角色 -->
      <div>
        <button
          type="button"
          :class="{ active: registerDTO.role === 'user' }"
          @click="registerDTO.role = 'user'"
        >
          用户
        </button>
        <button
          type="button"
          :class="{ active: registerDTO.role === 'landlord' }"
          @click="registerDTO.role = 'landlord'"
        >
          房东
        </button>
      </div>
      <input v-model="registerDTO.isActive" type="checkbox" checked> 激活账号
      <button type="submit">注册</button>
    </form>
    <p>已有账号？<router-link to="/">登录</router-link></p>
  </div>
</template>

<script>
import api from '@/api';

export default {
  name: 'AppRegister',
  data() {
    return {
      registerDTO: {
        username: '',
        password: '',
        email: '',
        // 初始化角色
        role: 'user', 
        isActive: true
      }
    };
  },
  methods: {
    async handleRegister() {
      try {
        const response = await api.post('/api/users/register', this.registerDTO);
        if (response) {
          alert('注册成功，请前往登录页面');
          this.$router.push({ name: 'AppLogin' });
        } else {
          alert(response.data);
        }
      } catch (error) {
        console.error('注册出错:', error);
        alert('注册出错，请稍后重试');
      }
    }
  }
};
</script>

<style scoped>
/* 为激活状态的按钮添加样式 */
button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}
</style>