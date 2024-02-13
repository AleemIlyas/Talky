import axios from 'axios'

const apiInstance = axios.create({
  baseURL: 'https://talky-backend.vercel.app/'
})

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiInstance;