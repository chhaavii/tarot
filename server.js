const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3847;

// In-memory storage for serverless environment
let readings = [];

// Initialize with some sample data if empty
if (readings.length === 0) {
  readings = [
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
}

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// ── Save a reading ────────────────────────────────────────────────────
app.post('/api/readings', (req, res) => {
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
});

// ── Get all readings (history) ────────────────────────────────────────
app.get('/api/readings', (req, res) => {
  const all = readings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(all);
});

// ── Get single reading ────────────────────────────────────────────────
app.get('/api/readings/:id', (req, res) => {
  const r = readings.find(reading => reading.id === req.params.id);
  if (!r) return res.status(404).json({ error: 'Not found' });
  res.json(r);
});

// ── Stats endpoint ────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
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
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✦ Celestial Oracle backend running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
