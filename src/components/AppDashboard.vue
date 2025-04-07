<template>
  <div>
    <h2>欢迎，{{ username }}</h2>
    <button @click="handleLogout">登出</button>
    <button @click="showChangePassword = true">账号管理</button>
    <button @click="viewAdvertisements">查看广告</button>

    <div v-if="showChangePassword">
      <h3>修改密码</h3>
      <form @submit.prevent="handleChangePassword">
        <input v-model="changePasswordDTO.oldPassword" type="password" placeholder="旧密码" required>
        <input v-model="changePasswordDTO.newPassword" type="password" placeholder="新密码" required>
        <button type="submit">保存</button>
        <button @click="showChangePassword = false">取消</button>
      </form>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  name: 'AppDashboard',
  data() {
    return {
      username: localStorage.getItem('username'),
      userId: localStorage.getItem('userId'),
      showChangePassword: false,
      changePasswordDTO: {
        userId: localStorage.getItem('userId'),
        oldPassword: '',
        newPassword: ''
      }
    };
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      this.$router.push({ name: 'AppLogin' });
    },
    async handleChangePassword() {
      try {
        const response = await api.post('/api/users/change-password', this.changePasswordDTO);
        if (response) {
          alert('密码修改成功');
          // 清除本地存储的用户信息
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('userId');
          // 重定向到登录页面
          this.$router.push({ name: 'AppLogin' });
          this.showChangePassword = false;
        } else {
          alert(response.data);
        }
      } catch (error) {
        console.error('修改密码出错:', error);
        alert('修改密码出错，请稍后重试');
      }
    },
    viewAdvertisements() {
      // 使用 $router.push 跳转到 AdBoard 页面
      this.$router.push({ name: 'AdBoard' }); 
    }
  }
};
</script>
