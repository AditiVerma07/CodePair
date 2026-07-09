import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async signup(name, email, password) {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },

  async refresh() {
    const response = await api.post('/auth/refresh');
    return response.data;
  }
};
