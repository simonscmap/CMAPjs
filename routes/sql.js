const router = require('express').Router();
const ctrSql = require('../controllers/sql');
const verifyToken = require('../controllers/verifyToken');



///////////////// custom query statement route /////////////////
router.post('/query', verifyToken, ctrSql.customQuery);


/////////////////// stored procedure route  ///////////////////
router.post('/sp', verifyToken, ctrSql.storedProcedure);



module.exports = router;