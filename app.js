/**
 * @author Arash Alaei <arashalaei22@gmail.com>. 
 */
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Set security HTTP headers
app.use(helmet());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
// Limit requests from same API
const limiter = rateLimit({
    max: 100, 
    windowMs: 60 * 60 * 1000, 
    message: 'Too many requests from this IP, please try again in an hour!'
})
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
    hpp({
            whitelist: [
                'duration',
                'ratingsQuantity',
                'ratingsAverage',
                'maxGroupSize',
                'difficulty',
                'price'
            ]
        })
    );

// Global middleware
app.use((req, res, next) =>{
    console.log('From global middleware');
    next();
})
// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter)

app.all('*', (req, res, next) => {
    const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
    next(err);
})

app.use(globalErrorHandler)
module.exports = app;