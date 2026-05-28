const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatment.controller');

router.get('/', treatmentController.getAllTreatments);
router.get('/:id', treatmentController.getTreatmentById);
router.post('/', treatmentController.createTreatment);
router.put('/:id', treatmentController.updateTreatment);

module.exports = router;
