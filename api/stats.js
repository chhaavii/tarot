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
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const all = readings;
  const cardCount = {};
  all.forEach(r => r.cards.forEach(c => {
    cardCount[c.name] = (cardCount[c.name] || 0) + 1;
  }));
  const topCards = Object.entries(cardCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  res.json({
    totalReadings: all.length,
    topCards,
    recentReadings: all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map(r => ({
      id: r.id,
      createdAt: r.createdAt,
      sunsign: r.seeker.sunsign,
      question: r.question.slice(0, 60) + (r.question.length > 60 ? '…' : ''),
      spread: r.spread,
    }))
  });
};
