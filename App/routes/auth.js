const express = require('express');
const authController = require('../controllers/auth_register');
const authLogin = require('../controllers/auth_login');
const authNewGroup = require('../controllers/auth_newgroup');
const authProfileLogOut = require('../controllers/auth_profile')

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authLogin.login);
router.post('/GR',authNewGroup.newGroup);

router.get('/logout',authProfileLogOut.logOut)
module.exports = router;