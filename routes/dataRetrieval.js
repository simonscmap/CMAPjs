const router = require('express').Router();
const dataRetrievalController = require('../controllers/dataRetrieval');

// Custom query statement route
router.post('/query', dataRetrievalController.customQuery);

// Stored procedure route
router.post('/sp', dataRetrievalController.storedProcedure);

module.exports = router;