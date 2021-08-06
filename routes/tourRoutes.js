const router = require('express').Router()
const tourController = require('./../controllers/tourController');

router.param('id', tourController.checkID2);

router
        .route('/')
        .get(tourController.getAllTours)
        .post(tourController.createNewTour)

router
        .route('/:id')
        .get(tourController.checkID, tourController.getTour)
        .patch(tourController.updateTour)
        .delete(tourController.deleteTour)

module.exports = router