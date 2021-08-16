const AppError = require('./../utils/AppError');

const handleCastErrorDB = (error) => (
    new AppError(`Invalid ${error.path}: ${error.value}`, 400)
)

const handleValidationErrorDB = (error) => (
    new AppError(error.message, 400)
)

const handleDuplicateErrorDB = (error) => {
    const field = Object.entries(error.keyValue)[0][0]
    return new AppError(`Duplicate field ${field} : ${error.keyValue.name}. Please use another value`, 400)
};

const sendDevError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status, 
        message: err.message, 
        err,
        stack: err.stack
    })
}

const sendProdError = (err, res) => {
    if(err.isOpertional){
        res.status(err.statusCode).json({
            status: err.status, 
            message: err.message
        })
    }else{
        // 1) Log error
        console.error('ERROR 💥', err);

        // 2) Send generic message
        res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
        });
    }
}

module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendDevError(err, res);
    }else if(process.env.NODE_ENV === 'production'){
        let error = {...err};
        error.message = err.message;
        error.code = err.code;

        if(err.name === 'CastError') error = handleCastErrorDB(error);
        if(err.name === 'ValidationError') error = handleValidationErrorDB(error);
        if(err.code === 11000) error = handleDuplicateErrorDB(error);
        sendProdError(error, res)
    }

    res.status(err.statusCode).json({
        status: err.status, 
        message: err.message
    });
}