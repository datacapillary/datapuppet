var express = require('express');
var router = express.Router();

const hostController = require('../controllers/host');

router.get('/create', hostController.getCreate);
router.post('/create', hostController.postCreate);
router.post('/delete', hostController.postDelete);

router.get('/:id', hostController.index);
router.get('/:id/crawl', hostController.getCrawl);
router.get('/:id/extract', hostController.getExtract);
router.post('/:id/update', hostController.postUpdate);

module.exports = router;
