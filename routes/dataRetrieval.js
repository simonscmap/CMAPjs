const router = require('express').Router();
const dataRetrievalController = require('../controllers/dataRetrieval');

const asyncControllerWrapper = require('../errorHandling/asyncControllerWrapper');

// Custom query statement route
router.post('/query', asyncControllerWrapper(dataRetrievalController.customQuery));

// Stored procedure route
router.post('/sp', asyncControllerWrapper(dataRetrievalController.storedProcedure));

module.exports = router;