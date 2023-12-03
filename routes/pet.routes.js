const express = require('express');
const router = express.Router();
const controller = require('../controllers/pet.controller');
const schema = require('../utils/schema');

router.post('/',controller.addPet);
//router.post('/', schema.validate(schema.pet), petsController.addPet);
router.get('/:id', controller.getPetById);
router.put('/:id', controller.editPet);
router.get('/', controller.getPets);
router.post('/:id/adopt', controller.adoptPet);
router.post('/:id/foster', controller.fosterPet);
router.post('/:id/return', controller.returnPet);
router.post('/:id/save', controller.savePet);
router.delete('/:id/save', controller.deleteSavedPet);
router.get('/user/:id', controller.getPetsByUser);

module.exports = router;