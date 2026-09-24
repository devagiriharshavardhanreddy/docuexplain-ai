import api from './api';

export const docService = {
  async uploadDocument(formData, onProgress) {
    const res = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
    return res.data;
  },

  async getDocuments() {
    const res = await api.get('/documents');
    return res.data;
  },

  async getDocumentDetail(documentId) {
    const res = await api.get(`/documents/${documentId}`);
    return res.data;
  },

  async deleteDocument(documentId) {
    const res = await api.delete(`/documents/${documentId}`);
    return res.data;
  }
};
