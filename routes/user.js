const router = require('express').Router();
const userController = require('../controllers/user');
const passport = require('../middleware/passport');

const asyncControllerWrapper = require('../errorHandling/asyncControllerWrapper');

///////////////// signup route /////////////////
router.post('/signup', asyncControllerWrapper(asyncControllerWrapper(userController.userSignup)));

///////////////// signin route /////////////////
router.post('/signin', passport.authenticate('local', {session:false}), asyncControllerWrapper(userController.userSignin));

///////////////// profile route /////////////////
// router.get('/profile', verifyToken, (req, res, next) => {
//     res.status(200).json({message: 'profile'});
// });

module.exports = router;
