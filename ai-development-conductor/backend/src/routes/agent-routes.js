const express = require('express');
const router = express.Router();
const AgentController = require('../controllers/AgentController');

// Agent coordination endpoints
router.get('/status', AgentController.getAgentStatus);
router.post('/activate', AgentController.activateAgent);
router.post('/coordinate', AgentController.coordinateAgents);
router.get('/logs', AgentController.getAgentLogs);

module.exports = router;
