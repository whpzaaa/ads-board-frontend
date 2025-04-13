import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 替换为实际的后端接口地址
  timeout: 5000
});

// 响应拦截器，直接返回响应数据
api.interceptors.response.use(
  response => {
    return response.data; // 直接返回响应数据
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;
