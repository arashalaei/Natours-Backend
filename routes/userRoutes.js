const router = require('express').Router()
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authCntroller');

router.post('/signup', authController.signup)
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