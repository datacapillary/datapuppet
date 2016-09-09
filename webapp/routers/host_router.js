var express = require('express');
var router = express.Router();

const hostController = require('../controllers/host');
const crawlRuleController = require('../controllers/crawl_rule');

router.get('/create', hostController.getCreate);
router.post('/create', hostController.postCreate);
router.post('/delete', hostController.postDelete);

router.get('/:id', hostController.index);
router.get('/:id/extract', hostController.getExtract);
router.post('/:id/edit', hostController.postEdit);

router.get('/:id/crawl_rule/index', crawlRuleController.getIndex);
router.get('/:id/crawl_rule/create', crawlRuleController.getCreate);
router.post('/:id/crawl_rule/create', crawlRuleController.postCreate);
router.get('/:id/crawl_rule/:rule_id/edit', crawlRuleController.getEdit);
router.post('/:id/crawl_rule/edit', crawlRuleController.postEdit);
router.post('/:id/crawl_rule/delete', crawlRuleController.postDelete);

module.exports = router;
