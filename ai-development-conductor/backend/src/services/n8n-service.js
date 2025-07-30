const axios = require('axios');

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

class N8nService {
  async triggerWorkflow(workflowId, data) {
    try {
      const response = await axios.post(`${N8N_WEBHOOK_URL}/${workflowId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error triggering n8n workflow ${workflowId}:`, error);
      throw new Error('Failed to trigger n8n workflow');
    }
  }
}

module.exports = new N8nService();
