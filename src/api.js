import axios from 'axios';
import router from '@/router'; // 假设你的路由配置文件在该路径

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8080', 
  timeout: 5000
});

// 请求拦截器，在每个请求发送前添加 token 到请求头
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['token'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求拦截器出错:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 清除本地存储的 token 等用户信息
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      // 重定向到登录页面
      router.push({ name: 'AppLogin' });
    }
    console.error('响应拦截器出错:', error);
    return Promise.reject(error);
  }
);

export default api;
