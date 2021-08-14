const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/APIFeatures');
// Get top 5 cheap
exports.aliasTopTours = (req, res, next) => {
    req.query.sort = 'price,-ratingsAverage'
    req.query.limit = 5;
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next();
};
// Get all tours
exports.getAllTours = async (req, res) =>{
    try {
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()

        const tours = await features.query;

        res.status(200).json({
            status: 'success',
            length: tours.length,
            tours
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error
        })
    }
}
// Get a tour
exports.getTour = async (req, res) =>{
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            tour
        })
    } catch (error) {
        res.status(403).json({
            status: 'fail',
            message: 'tour not found.'
        })
    }
}
// Create new   
exports.createNewTour = async (req, res) =>{
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error
        })
    }
}
// Update the tour
exports.updateTour = async (req, res) =>{
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,{runValidator: true, new: true});
        res.status(200).json({
            status: 'success',
            date:{
                tour
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error
        })
    }
};
// Delete the tour
exports.deleteTour = async (req, res) =>{
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            date: null
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error
        })
    }
};

// middleware
// exports.checkID = (req, res, next) =>{
//     let id = +req.params.id;
//     if(id > data.length)
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid tour ID from checkID 1'
//         })
//     next();
// }

// exports.checkID2 = (req, res, next, val) =>{
//     if(val < 0)
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Invalid tour ID from checkID 2'
//         })
//     next();
// }

// Aggregations

exports.getTourStats  = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: {ratingsAverage: {$gte: 4.5}}
            },
            {
                $group:{
                    _id: {$toUpper: '$difficulty'},
                    numTours: {$sum: 1},
                    numRatings: {$sum:'$ratingsQuantity'}, 
                    avgRating: {$avg: '$ratingsAverage'}, 
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: "$price"},
                    maxPrice: {$max: '$price'}
                }
            },
            {
                $sort:{avgPrice: 1}
            },
            {
                $match: {_id:{$ne: 'EASY'}}
            }
        ])
        res.status(200).json({
            status: 'success',
            data:{
                stats
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            error
        })
    }
    
}

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = +req.params.year;
        const plans = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match:{
                    startDates:{
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group:{
                    _id: {$month: '$startDates'},
                    numTourStarts: {$sum: 1},
                    tours: {$push:'$name'}
                }
            },
            {
                $addFields:{month: '$_id'}
            },
            {
                $project: {_id: 0}
            },
            {
                $sort:{numTourStarts: -1}
            },
            {
                $limit: 12
            }
        ]);

        res.status(200).json({
            status: 'success',
            data:{
                plans
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            error
        })
    }
}