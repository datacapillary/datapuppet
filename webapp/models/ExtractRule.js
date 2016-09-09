const mongoose = require('mongoose');

const extractRuleSchema = new mongoose.Schema({
  name: { type: String },
  host_id: { type: String },
  crawl_rule_id: { type: String },
  field: { type: String },
  extract_method: { type: String },
  pattern: { type: String },
  exclude_pattern: { type: String },
  active: { type: Boolean }
}, { timestamps: true });

const ExtractRule = mongoose.model('ExtractRule', extractRuleSchema);
module.exports = ExtractRule;
