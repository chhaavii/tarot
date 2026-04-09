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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const r = readings.find(reading => reading.id === id);
  if (!r) return res.status(404).json({ error: 'Not found' });
  res.json(r);
};
