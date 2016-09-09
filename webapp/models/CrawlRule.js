const mongoose = require('mongoose');

const crawlRuleSchema = new mongoose.Schema({
  name: { type: String, index: true },
  host_id: { type: String, index: true },
  page_type: { type: String },
  pattern: { type: String },
  exclude_pattern: { type: String },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const CrawlRule = mongoose.model('CrawlRule', crawlRuleSchema);
module.exports = CrawlRule;
