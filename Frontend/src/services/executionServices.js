import api from './api';

export const executionService = {
  async runCode(roomId, code, language) {
    const response = await api.post(`/rooms/${roomId}/run`, {
      code,
      language
    });
    return response.data;
  }
};
