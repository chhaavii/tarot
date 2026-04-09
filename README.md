# ☽ ✦ ☾ The Celestial Oracle — Tarot Reader

A full-stack mystical tarot reading app with AI-powered readings, shuffle animations, and persistent storage.

## Stack
- **Frontend**: Vanilla HTML/CSS/JS with 3D card flip & shuffle animations
- **Backend**: Node.js + Express  
- **Database**: JSON flat file via `lowdb` (zero config, no external DB needed)
- **AI**: Claude claude-sonnet-4-20250514 for personalized readings

## Setup

```bash
# 1. Install dependencies (already done if you received this folder)
npm install

# 2. Start the server
node server.js
# or: bash start.sh

# 3. Open your browser
open http://localhost:3847
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET`  | `/api/readings` | List all readings (newest first) |
| `POST` | `/api/readings` | Save a new reading |
| `GET`  | `/api/readings/:id` | Get a single reading by ID |
| `GET`  | `/api/stats` | Total count + top cards + recent readings |

## Data Storage

All readings are saved to `readings.json` in the project root. Each record includes:
- Seeker's birth info (DOB, time, place, sun sign)
- The question asked
- Spread type (3, 5, or 7 cards)
- Each card drawn (name, position, upright/reversed, meanings)
- The full AI-generated reading text
- Timestamp

## Features
- **Shuffle animation**: Cards burst apart and reconverge 3× when shuffled
- **3D card flip**: CSS `rotateY(180deg)` reveal on card selection
- **Fan layout**: Cards spread in an arc like a real tarot reader
- **History panel**: Slide-in sidebar showing all past readings
- **Stats bar**: Live count of total readings and most-drawn card
- **Toast notifications**: Confirmation when readings are saved
- **Fully responsive**: Works on mobile

## Changing the Port

Edit `server.js` line 7:
```js
const PORT = 3847; // change this
```

And update `public/index.html` line ~320:
```js
const API_BASE = 'http://localhost:3847'; // match the port
```
