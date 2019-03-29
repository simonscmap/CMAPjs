const router = require('express').Router();
const userController = require('../controllers/user');
const passport = require('../middleware/passport');


///////////////// root route /////////////////
router.get('/', (req, res, next)=>{
    res.status(200).json({msg: 'user root route'});
});

///////////////// signup route /////////////////
router.post('/signup', userController.userSignup);

///////////////// signin route /////////////////
router.post('/signin', passport.authenticate('local', {session:false}), userController.userSignin);

///////////////// profile route /////////////////
// router.get('/profile', verifyToken, (req, res, next) => {
//     res.status(200).json({message: 'profile'});
// });

module.exports = router;
