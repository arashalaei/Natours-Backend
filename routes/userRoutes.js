const router = require('express').Router()
const userController = require('./../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/forgotpassword', authController.forgotpassword);
router.post('/resetPassword/:token', authController.resetpassword);
router.post('/updateMyPassword', authController.protect, authController.updateMyPassword)

router
            .route('/')
            .get(userController.getAllUsers)
            .post(userController.createNewUser)
router
            .route('/:id')
            .get(userController.getUser)
            .patch(userController.updateUser)
            .delete(userController.deleteUser)

module.exports = router