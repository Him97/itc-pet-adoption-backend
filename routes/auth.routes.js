const express = require('express');
const router = express.Router();
const schema = require('../utils/schema');
const controller = require('../controllers/auth.controller');

router.post('/login', controller.login);
router.post('/signup', schema.validate(schema.user), controller.signup);
router.get('/login', controller.getCurrentUser);

module.exports = router;