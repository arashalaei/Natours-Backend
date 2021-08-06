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

app.get('/',(req, res) => {
    res.status(200).write(
        `
    <div>
        <h1>Hello World</h1>
        <h2>Let's start fantastic journey!!!</h2>
    </div>
`);
})

// Get all tours
app.get('/api/v1/tours', (req, res) =>{
    res.status(200).json({
        status: 'success',
        length: data.length,
        data
    })
});

// Get a tour
app.get('/api/v1/tours/:id',(req, res) =>{
    const id = +req.params.id;
    res.status(200).json({
        status: 'success',
        data: data[id]
    })
})

// Create new tour
app.post('/api/v1/tours', (req, res) =>{
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
});

// Update the tour
app.patch('/api/v1/tours/:id', (req, res) =>{
    res.status(200).json({
        status: 'success',
        message: 'Not defined yet.'
    })
});

// Delete the tour
app.delete('/api/v1/tours/:id', (req, res) =>{
    res.status(204).json({
        status: 'success',
        message: null
    })
});

// Get all users
app.get('/api/v1/users', (req, res) =>{
    res.status(200).json({
        status: 'success',
        message: 'not defines yet!'
    })
});
// Get a user
app.get('/api/v1/users/:id', (req, res) =>{
    res.status(200).json({
        status: 'success',
        message: 'not defines yet!'
    })
});
// Create new user
app.post('/api/v1/users/:id', (req, res) =>{
    res.status(201).json({
        status: 'success',
        message: 'not defines yet!'
    })
});
// update user
app.patch('/api/v1/users/:id', (req, res) =>{
    res.status(200).json({
        status: 'success',
        message: 'not defines yet!'
    })
});
// delete user
app.delete('/api/v1/users/:id', (req, res) =>{
    res.status(204).json({
        status: 'success',
        message: null
    })
}); 
const PORT = 3000;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server is listening on port ${PORT}`);
})