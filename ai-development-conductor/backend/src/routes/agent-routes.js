const express = require('express');
const router = express.Router();
const AgentController = require('../controllers/AgentController');

// Enhanced routes for multi-agent system
router.get('/status', AgentController.getAgentStatus);
router.post('/activate', AgentController.activateAgent);
router.post('/coordinate', AgentController.coordinateAgents);
router.post('/workflow/start', AgentController.startProjectWorkflow);
router.get('/logs', AgentController.getAgentLogs);

// New routes for Phase 2
router.get('/definitions', AgentController.getAgentDefinitions);
router.get('/workflows', AgentController.getAvailableWorkflows);
router.post('/workflow/:workflowId/execute', AgentController.executeWorkflow);

module.exports = router;
