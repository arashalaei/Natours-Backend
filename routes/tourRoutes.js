const router = require('express').Router()
const tourController = require('./../controllers/tourController');
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