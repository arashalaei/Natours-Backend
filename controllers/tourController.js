const Tour = require('./../models/tourModel');

// Get all tours
exports.getAllTours = async (req, res) =>{
    try {
        // Filtering
        const queryObj = {...req.query}
        const excluded = ['fields', 'sort', 'page', 'limit'];
        excluded.forEach(item => delete queryObj[item]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(lt|gt|gte|lte|ne)\b/g, match => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));
        // limit field
        if(req.query.fields){
            const limitBy = req.query.fields.split(',').join(' ');
            query = query.select(limitBy)
        }else{
            query = query.select('-__v');
        }
        // Sort
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy)
        }else{
            query = query.sort('-createdAt');
        }
        // pagination
        const limit = +req.query.limit || 100;
        const page  = +req.query.page || 1; 
        const skip  = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
         
        const tours = await query;
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