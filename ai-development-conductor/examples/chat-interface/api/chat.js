const express = require('express');
const router = express.Router();

let messages = [];

router.get('/messages', (req, res) => {
  res.json({ messages });
});

router.post('/messages', (req, res) => {
  const message = {
    id: Date.now(),
    ...req.body,
    timestamp: new Date().toISOString(),
  };
  messages.push(message);
  req.app.get('io').emit('new_message', message);
  res.status(201).json({ message });
});

router.post('/suggestions', (req, res) => {
  const { partialMessage } = req.body;
  // In a real app, you'd call an AI service here.
  const suggestions = [
    `${partialMessage} with AI`,
    `${partialMessage} and more`,
    `${partialMessage} for the team`,
  ];
  res.json({ suggestions });
});

module.exports = router;
