/**
 * @author Arash Alaei <arashalaei22@gmail.com>. 
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const data = JSON.parse(fs.readFileSync(path.join(__dirname, './dev-data/data/tours-simple.json'),{encoding:'utf-8'}));

// Global middleware
app.use(express.json());

// Get all tours
const getAllTours = (req, res) =>{
    res.status(200).json({
        status: 'success',
        length: data.length,
        data
    })
}
// Get a tour
const getTour = (req, res) =>{
    const id = +req.params.id;
    res.status(200).json({
        status: 'success',
        data: data[id]
    })
}
// Create new tour
const createNewTour = (req, res) =>{
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
const updateTour = (req, res) =>{
    res.status(200).json({
        status: 'success',
        message: 'Not defined yet.'
    })
};
// Delete the tour
const deleteTour = (req, res) =>{
    res.status(204).json({
        status: 'success',
        message: null
    })
};

// Get all users
const getAllUsers = (req, res) =>{
    res.status(200).json({
        status: 'success',
        message: 'not defines yet!'
    })
}
// Get a user
const getUser = (req, res) =>{
    res.status(200).json({
        status: 'success',
        message: 'not defines yet!'
    })
}
// Create new user
const createNewUser = (req, res) =>{
    res.status(201).json({
        status: 'success',
        message: 'not defines yet!'
    })
}
// Update user
const updateUser = (req, res) =>{
    res.status(200).json({
        status: 'success',
        message: 'not defines yet!'
    })
}
// delete user
const deleteUser = (req, res) =>{
    res.status(204).json({
        status: 'success',
        message: null
    })
}
// Tour
app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createNewTour)

app
    .route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)
// User
app
    .route('/api/v1/users')
    .get(getAllUsers)
    .post(createNewUser)

app
    .route('/api/v1/users/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

const PORT = 3000;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server is listening on port ${PORT}`);
})