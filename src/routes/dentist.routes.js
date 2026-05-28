const express = require('express');
const router = express.Router();
const dentistController = require('../controllers/dentist.controller');

router.get('/', dentistController.getAllDentists);
router.get('/:id', dentistController.getDentistById);
router.post('/', dentistController.createDentist);

module.exports = router;
