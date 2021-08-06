const fs = require('fs');
const path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, './../dev-data/data/tours-simple.json'),{encoding:'utf-8'}));

// Get all tours
exports.getAllTours = (req, res) =>{
    res.status(200).json({
        status: 'success',
        length: data.length,
        data
    })
}
// Get a tour
exports.getTour = (req, res) =>{
    const id = +req.params.id;
    res.status(200).json({
        status: 'success',
        data: data[id]
    })
}
// Create new tour
exports.createNewTour = (req, res) =>{
    const id = data[data.length - 1].id + 1;
    const {name = 'Spain', duration = 2} = req.body;
    const newTour = Object.assign({id, name, duration}, {});
    data.push(newTour);
    fs.writeFileSync(path.join(__dirname, './dev-data/data/tours-simple.json'),JSON.stringify(data));
    console.log(newTour);
    res.status(201).json({
        status: 'success',
        tour: newTour
    })
}
// Update the tour
exports.updateTour = (req, res) =>{
    res.status(200).json({
        status: 'success',
        message: 'Not defined yet.'
    })
};
// Delete the tour
exports.deleteTour = (req, res) =>{
    res.status(204).json({
        status: 'success',
        message: null
    })
};

// middleware
exports.checkID = (req, res, next) =>{
    let id = +req.params.id;
    if(id > data.length)
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid tour ID from checkID 1'
        })
    next();
}

exports.checkID2 = (req, res, next, val) =>{
    if(val < 0)
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid tour ID from checkID 2'
        })
    next();
}