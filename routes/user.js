const router = require('express').Router();
const ctrUser = require('../controllers/user');
const verifyToken = require('../controllers/verifyToken');


///////////////// root route /////////////////
router.get('/', (req, res, next)=>{
    res.status(200).json({msg: 'user root route'});
});

///////////////// signup route /////////////////
router.post('/signup', ctrUser.userSignup);

///////////////// signin route /////////////////
router.post('/signin', ctrUser.userSignin);

///////////////// profile route /////////////////
router.get('/profile', verifyToken, (req, res, next) => {
    res.status(200).json({message: 'profile'});
});






module.exports = router;
