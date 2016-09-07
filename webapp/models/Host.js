const mongoose = require('mongoose');
const uuid = require('node-uuid');

const hostSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1, index: { unique: true }},
  domain: { type: String, index: { unique: true }},
  owner: {type: String},

  setting: {
    encode: { type: String },
    priority: { type: Number, min: 1, max: 5 },
    daily_limit: { type: Number, default: 50000 },
    crawl_interval: { type: Number, default: 10000 }
  },

  rules: [{
    name: { type: String },
    rule_id: { type: String },
    page_type: { type: String },
    active: { type: Boolean },
    pattern: { type: String },
    selectors: [{
      type: { type: String },
      field: { type: String },
      pattern: { type: String },
      active: { type: Boolean }
    }]
  }]
}, { timestamps: true });

const Host = mongoose.model('Host', hostSchema);
module.exports = Host;
