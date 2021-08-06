/**
 * @author Arash Alaei <arashalaei22@gmail.com>. 
 */
const express = require('express');
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes');

const app = express();

// Global middleware
app.use(express.json());
app.use((req, res, next) =>{
    console.log('From global middleware');
    next();
})
// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

const PORT = 3000;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server is listening on port ${PORT}`);
})