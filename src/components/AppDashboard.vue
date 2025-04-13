<template>
  <div>
    <h2>欢迎，{{ username }}</h2>
    <button @click="handleLogout">登出</button>
    <button @click="showChangePassword = true">账号管理</button>
    <button @click="viewAdvertisements">查看广告</button>
<<<<<<< HEAD
=======
    <!-- 只有 admin 角色显示用户管理按钮 -->
    <button v-if="userRole === 'admin'" @click="manageUsers">管理用户</button>
>>>>>>> 26cae8b (权限控制)

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
<<<<<<< HEAD
=======
import { useStore } from 'vuex';
>>>>>>> 26cae8b (权限控制)

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
<<<<<<< HEAD
=======
  setup() {
    const store = useStore();
    return {
      userRole: store.state.userRole
    };
  },
>>>>>>> 26cae8b (权限控制)
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
<<<<<<< HEAD
=======
    },
    manageUsers() {
      console.log('尝试跳转到用户管理页面');
      this.$router.push({ name: 'UserManagement' });
>>>>>>> 26cae8b (权限控制)
    }
  }
};
</script>
