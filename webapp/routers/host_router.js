var express = require('express');
var router = express.Router();

const hostController = require('../controllers/host');

router.get('/create', hostController.getCreate);
router.post('/create', hostController.postCreate);
router.post('/delete', hostController.postDelete);

router.get('/:id', hostController.getEdit);
router.post('/:id', hostController.postEdit);

module.exports = router;
