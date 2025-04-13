<template>
  <div>
    <h1>用户管理页面</h1>
    <!-- 查询用户 -->
    <button @click="fetchUsers">查询所有用户</button>
    <!-- 用户列表 -->
    <table v-if="users.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>用户名</th>
          <th>新密码</th>
          <th>角色</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.userId">
          <td>{{ user.userId }}</td>
          <td>{{ user.username }}</td>
          <td>
            <input
              v-model="user.newPassword"
              type="password"
              placeholder="输入新密码"
            />
          </td>
          <td>
            <select v-model="user.role">
              <option value="admin">Admin</option>
              <option value="landlord">Landlord</option>
              <option value="user">User</option>
            </select>
          </td>
          <td>
            <button @click="applyChanges(user)">Apply</button>
            <button @click="deleteUser(user.userId)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>暂无用户信息</p>
  </div>
</template>

<script>
import api from '@/api';

export default {
  name: 'UserManagement',
  data() {
    return {
      users: []
    };
  },
  methods: {
    // 查询所有用户
    async fetchUsers() {
      try {
        const response = await api.get('/api/users');
        console.log('后端返回的数据:', response); // 打印后端返回的数据，方便调试

        if (Array.isArray(response)) {
          this.users = response.map(user => ({
            ...user,
            newPassword: ''
          }));
        } else {
          console.error('后端返回的数据不是数组:', response);
          alert('查询用户失败，后端返回数据格式错误');
        }
      } catch (error) {
        console.error('查询用户失败', error);
        alert('查询用户失败，请稍后重试');
      }
    },
    // 应用修改
    async applyChanges(user) {
      try {
        const updateData = {
          userId: user.userId,
          role: user.role
        };

        if (user.newPassword) {
          // 将字段名改为 passwordHash
          updateData.passwordHash = user.newPassword; 
        }

        const response = await api.put(`/api/users/${user.userId}`, updateData);
        if (response === '更新成功') {
          alert('用户信息更新成功');
          // 清空新密码输入框
          user.newPassword = ''; 
        } else {
          alert('用户信息更新失败，请检查用户是否存在');
        }
      } catch (error) {
        console.error('更新用户失败', error);
        alert('更新用户失败，请稍后重试');
      }
    },
    // 删除用户
    async deleteUser(id) {
      if (confirm('确定要删除该用户吗？')) {
        try {
          const response = await api.delete(`/api/users/${id}`);
          if (response === '删除成功') {
            alert('用户删除成功');
            // 删除成功后重新获取数据
            await this.fetchUsers(); 
          } else {
            alert('用户删除失败，请检查用户是否存在');
          }
        } catch (error) {
          console.error('删除用户失败', error);
          alert('删除用户失败，请稍后重试');
        }
      }
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
