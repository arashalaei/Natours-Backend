/**
 * @author Arash Alaei <arashalaei22@gmail.com>. 
 */
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
// Global middleware
app.use(express.json());
app.use((req, res, next) =>{
    console.log('From global middleware');
    next();
})
// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
    next(err);
})

app.use(globalErrorHandler)
module.exports = app;