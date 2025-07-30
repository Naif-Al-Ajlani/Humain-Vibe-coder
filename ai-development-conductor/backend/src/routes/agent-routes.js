const express = require('express');
const router = express.Router();

// Placeholder for agent routes
router.get('/', (req, res) => {
  res.json({ message: 'Agent status endpoint' });
});

module.exports = router;
