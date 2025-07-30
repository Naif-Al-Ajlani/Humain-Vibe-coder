const express = require('express');
const router = express.Router();
const AgentController = require('../controllers/AgentController');
const ProjectController = require('../controllers/ProjectController');

router.post('/:workflowId', async (req, res) => {
  const { workflowId } = req.params;
  const data = req.body;

  try {
    // This is a simplified example of how n8n could call back to the application
    console.log(`Received webhook for workflow ${workflowId} with data:`, data);

    if (data.status === 'completed') {
      if (workflowId === 'project_initialization') {
        await ProjectController.updateProjectWithAgentResult(data.projectId, data.result);
      }
    }

    res.status(200).json({ message: 'Webhook received' });
  } catch (error) {
    console.error(`Error processing webhook for workflow ${workflowId}:`, error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

module.exports = router;
