const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  _id: { type: String, required: true, index: { unique: true } },
  url: { type: String },
  redirects_to: { type: String },

  host_id: { type: String, index: true },
  rule_id: { type: String },
  failure_count: { type: Number },
  retries: { type: Number },

  error: {
    response_body: { type: String },
    response_code: { type: Number },
    details: { type: String }
  },

  history: [{
    timestamp: { type: String },
    event_type: { type: String },
    response_code: { type: Number }
  }]
}, { timestamps: true });

const Url = mongoose.model('Url', urlSchema);
module.exports = Url;
