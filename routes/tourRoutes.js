const router = require('express').Router()
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController'); 

// router.param('id', tourController.checkID2);
router
        .get('/tour-stats', authController.protect, authController.restrictTo('admin'),tourController.getTourStats);
router
        .get('/monthly-plan/:year', tourController.getMonthlyPlan);

router
        .route('/top-5-cheap')
        .get(tourController.aliasTopTours, tourController.getAllTours);

router
        .route('/')
        .get(tourController.getAllTours)
        .post(tourController.createNewTour)

router
        .route('/:id')
        .get(tourController.getTour)
        .patch(tourController.updateTour)
        .delete(tourController.deleteTour)

module.exports = router