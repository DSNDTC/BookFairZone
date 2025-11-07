import api from './api'

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  
  login: (data) => api.post('/auth/login', data),
  
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),
  
  logout: () => api.post('/auth/logout'),
  
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  resetPassword: (data) => api.post('/auth/reset-password', data)
}