const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.route('/signup').post(adminController.createNewUser);
router.route('/login').post(adminController.signinUser);

router.use;
router.route('/create').get(adminController.isLoggedIn, adminController.test);

module.exports = router;
