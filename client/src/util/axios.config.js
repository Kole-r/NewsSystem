import axios from 'axios'
import { useUserInfoStore } from '../store/userInfo'
import router from '../router'

const instance = axios.create({
  baseURL: '',
  timeout: 10000,
})

instance.interceptors.request.use(config => {
  const userInfoStore = useUserInfoStore()
  if (userInfoStore.token) {
    config.headers['Authorization'] = `Bearer ${userInfoStore.token}`
  }
  return config
})

instance.interceptors.response.use(
  response => {
    const newToken = response.headers['authorization']
    if (newToken) {
      const userInfoStore = useUserInfoStore()
      userInfoStore.updateToken(newToken)
    }
    return response
  },
  error => {
    if (error.response?.status === 401) {
      const userInfoStore = useUserInfoStore()
      userInfoStore.clearInfo()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default instance
