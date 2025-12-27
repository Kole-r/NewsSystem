import axios from 'axios';
const instance = axios.create();

// 请求拦截器
instance.interceptors.request.use(function (config) {
    console.log('=== Axios 请求拦截器触发 ===');
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    } else {
        console.warn('警告：localStorage 中没有 token');
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use(function (response) {
    console.log('=== Axios 响应拦截器触发 ===');
    const token = response.headers?.authorization;
    if (token) {
        localStorage.setItem('token', token);
        console.log('Token 已保存到 localStorage');
    }
    return response;
}, function (error) {
    const { status } = error.response;
    if (status === 401) {
        alert('登录已过期，请重新登录');
        localStorage.clear();
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

export default instance;    