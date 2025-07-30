const express = require('express');
const router = express.Router();
const ExamplesController = require('../controllers/ExamplesController');

// Get all examples
router.get('/', ExamplesController.listExamples);

// Get specific example
router.get('/:id', ExamplesController.getExample);

// Generate new example
router.post('/generate', ExamplesController.generateExample);

// Update example (for n8n callbacks)
router.patch('/:id', ExamplesController.updateExample);

// Example preview endpoints
router.get('/:id/preview', (req, res) => {
  // Serve the generated example preview
  res.redirect(`/examples/${req.params.id}/build/index.html`);
});

module.exports = router;
