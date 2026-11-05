import api from './api.js';

export const authApi = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
  me: () => api.get('/user'),
};

export const requestApi = {
  list: (params) => api.get('/service-requests', { params }),
  get: (id) => api.get(`/service-requests/${id}`),
  create: (data) => api.post('/service-requests', data),
  update: (id, data) => api.put(`/service-requests/${id}`, data),
  remove: (id) => api.delete(`/service-requests/${id}`),
  setStatus: (id, data) => api.patch(`/service-requests/${id}/status`, data),
};

export const categoryApi = {
  list: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  remove: (id) => api.delete(`/categories/${id}`),
};

export const dashboardApi = { get: () => api.get('/dashboard') };

export const notificationApi = {
  list: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/read-all'),
};
