const express = require('express');
const schema = require('../utils/schema');
const controller = require('../controllers/user.controller');

const router = express.Router();

router.get('/', controller.getUsers);
router.get('/:id', controller.getUserById);
router.put('/:id', controller.updateUser);
router.get('/:id/full', controller.getUserByIdFull);

module.exports = router;