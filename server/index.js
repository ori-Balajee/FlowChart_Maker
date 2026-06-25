const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Flow = require('./models/Flow');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flowmaster';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Save the current flow (overwrite the single saved flow for simplicity)
app.post('/api/flow/save', async (req, res) => {
  try {
    const { nodes, edges } = req.body;
    // We'll use a fixed ID 'single-flow' to simulate a single user/session save
    await Flow.findByIdAndUpdate(
      '65a1234567890abcdef12345', // This is a dummy fixed ID; in real app we'd generate/use user ID
      { nodes, edges, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: 'Flow saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save flow' });
  }
});

// Load the saved flow
app.get('/api/flow/load', async (req, res) => {
  try {
    const flow = await Flow.findOne(); // Get the most recent saved flow
    if (!flow) {
      return res.status(404).json({ message: 'No saved flow found' });
    }
    res.status(200).json({ nodes: flow.nodes, edges: flow.edges });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load flow' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
