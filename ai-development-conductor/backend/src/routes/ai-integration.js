const express = require('express');
const router = express.Router();
const AIController = require('../controllers/AIController');

// Basic AI endpoints (expandable for all phases)
router.post('/prompt', AIController.processPrompt);
router.get('/models', AIController.getAvailableModels);
router.post('/generate', AIController.generateCode);

module.exports = router;
