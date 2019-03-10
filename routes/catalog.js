const router = require('express').Router();
const ctrCatalog = require('../controllers/catalog');




/////////////////// catalog root route  ///////////////////
router.get('/', ctrCatalog.retrieve);



module.exports = router;