// Return 404 to prevent crashes
module.exports = (req, res) => {
  res.status(404).json({ error: 'Not found' });
};
