// Simple stats endpoint
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Static response for now
  res.json({
    totalReadings: 1,
    topCards: [{name: "The Fool", count: 1}],
    recentReadings: [{
      id: 'e3cf1bfc-4701-4045-8d4f-f176f849562d',
      createdAt: '2026-04-09T10:37:48.969Z',
      sunsign: 'Taurus ♉',
      question: 'What path should I follow?',
      spread: 3
    }]
  });
};
