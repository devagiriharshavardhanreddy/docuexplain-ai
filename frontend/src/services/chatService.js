import api from './api';

export const chatService = {
  async sendChatMessage({ message, conversation_id, document_ids, include_xai = true }) {
    const res = await api.post('/chat', {
      message,
      conversation_id,
      document_ids,
      include_xai
    });
    return res.data;
  },

  async getConversations() {
    const res = await api.get('/chat/conversations');
    return res.data;
  },

  async getConversationHistory(conversationId) {
    const res = await api.get(`/chat/conversations/${conversationId}`);
    return res.data;
  },

  async deleteConversation(conversationId) {
    const res = await api.delete(`/chat/conversations/${conversationId}`);
    return res.data;
  }
};
