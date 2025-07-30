const express = require('express');
const router = express.Router();

const generateRandomData = (count) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push(Math.floor(Math.random() * 1000));
  }
  return data;
};

router.get('/data', (req, res) => {
  res.json({
    revenue: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: generateRandomData(6),
    },
    traffic: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: generateRandomData(4),
    },
    userSegments: generateRandomData(3),
    totalRevenue: 123456,
    activeUsers: 7890,
    conversionRate: 2.5,
  });
});

router.get('/insights', (req, res) => {
  res.json({
    insights: [
      {
        icon: '📈',
        title: 'Revenue Spike in March',
        description: 'Revenue saw a 25% increase in March, possibly due to the new marketing campaign.',
        confidence: 0.9,
      },
      {
        icon: '👥',
        title: 'High Engagement from New Users',
        description: 'New users are spending 50% more time on the platform compared to returning users.',
        confidence: 0.85,
      },
    ],
  });
});

router.post('/analyze', (req, res) => {
  const { metric, timeframe } = req.body;
  res.json({
    chartData: {
      labels: ['Data 1', 'Data 2', 'Data 3'],
      data: generateRandomData(3),
    },
  });
});

module.exports = router;
