var express = require('express');
var router = express.Router();

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('../config/passport');

/**
 * Controllers (route handlers).
 */
const userController = require('../controllers/user');
const reportController = require('../controllers/report');
const homeController = require('../controllers/home')

router.get('/', homeController.index);
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/logout', userController.logout);
router.get('/forgot', userController.getForgot);
router.post('/forgot', userController.postForgot);
router.get('/reset/:token', userController.getReset);
router.post('/reset/:token', userController.postReset);
router.get('/signup', userController.getSignup);
router.post('/signup', userController.postSignup);
router.get('/report', reportController.getReport);
router.post('/report', reportController.postReport);
router.get('/account', passportConfig.isAuthenticated, userController.getAccount);
router.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
router.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
router.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);

module.exports = router;
