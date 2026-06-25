const mongoose = require('mongoose');

const FlowSchema = new mongoose.Schema({
  nodes: { type: Array, required: true },
  edges: { type: Array, required: true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Flow', FlowSchema);
