const { v4: uuidv4 } = require('uuid');

// In-memory storage for serverless environment
let readings = [
  {
    id: 'e3cf1bfc-4701-4045-8d4f-f176f849562d',
    createdAt: '2026-04-09T10:37:48.969Z',
    seeker: {
      dob: null,
      birthtime: null,
      birthplace: null,
      sunsign: 'Taurus ♉',
    },
    question: 'What path should I follow?',
    spread: 3,
    cards: [{
      name: 'The Fool',
      num: 0,
      position: 1,
      reversed: false,
      upright: 'New beginnings, innocence, spontaneity',
      reversedMeaning: 'Foolishness, recklessness, risk-taking',
    }],
    readingText: null,
  }
];

module.exports = (req, res) => {
  // Enable CORS and JSON parsing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    // Get all readings
    const all = readings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(all);
  }
  
  if (req.method === 'POST') {
    // Save a new reading
    try {
      const { seeker, cards, spread, question, readingText } = req.body;
      if (!seeker || !cards || !question) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const record = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        seeker: {
          dob: seeker.dob || null,
          birthtime: seeker.birthtime || null,
          birthplace: seeker.birthplace || null,
          sunsign: seeker.sunsign || null,
        },
        question,
        spread,
        cards: cards.map(c => ({
          name: c.name,
          num: c.num,
          position: c.position,
          reversed: c.reversed,
          upright: c.upright,
          reversedMeaning: c.reversedMeaning,
        })),
        readingText: readingText || null,
      };
      readings.push(record);
      res.json({ success: true, id: record.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save reading' });
    }
    return;
  }
  
  res.status(405).json({ error: 'Method not allowed' });
};
