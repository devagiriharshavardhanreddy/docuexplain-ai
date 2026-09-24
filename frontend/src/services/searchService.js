import api from './api';

export const searchService = {
  async semanticSearch({ query, document_ids, top_k = 10, min_score = 0.2 }) {
    const res = await api.post('/search', {
      query,
      document_ids,
      top_k,
      min_score
    });
    return res.data;
  }
};

export const summaryService = {
  async summarizeDocument({ document_id, summary_type = 'detailed' }) {
    const res = await api.post('/summarize', {
      document_id,
      summary_type
    });
    return res.data;
  }
};

export const analyticsService = {
  async getAnalytics() {
    const res = await api.get('/analytics');
    return res.data;
  }
};
