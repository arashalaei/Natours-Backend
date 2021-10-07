const router = require('express').Router();
const reviewController = require('./../controllers/reviewController');

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(reviewController.createReview);

module.exports = router;