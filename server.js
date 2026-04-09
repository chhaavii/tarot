const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const app = express();
const PORT = 3847;

// DB setup - use /tmp for Vercel serverless
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/tmp/readings.json' 
  : path.join(__dirname, 'readings.json');
const adapter = new FileSync(dbPath);
const db = low(adapter);
db.defaults({ readings: [] }).write();

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
    db.get('readings').push(record).write();
    res.json({ success: true, id: record.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save reading' });
  }
});

// ── Get all readings (history) ────────────────────────────────────────
app.get('/api/readings', (req, res) => {
  const all = db.get('readings').orderBy('createdAt', 'desc').value();
  res.json(all);
});

// ── Get single reading ────────────────────────────────────────────────
app.get('/api/readings/:id', (req, res) => {
  const r = db.get('readings').find({ id: req.params.id }).value();
  if (!r) return res.status(404).json({ error: 'Not found' });
  res.json(r);
});

// ── Stats endpoint ────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  const all = db.get('readings').value();
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
    recentReadings: all.slice(0, 5).map(r => ({
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
