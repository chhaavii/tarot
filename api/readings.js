// Simple readings endpoint
const { v4: uuidv4 } = require('uuid');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    // Return empty array for now
    return res.json([]);
  }
  
  if (req.method === 'POST') {
    // Return success without actual processing
    return res.json({ success: true, id: uuidv4() });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
};
