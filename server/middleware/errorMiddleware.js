module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let message = err.message || 'Something went wrong!';

    // Handle Mongoose Duplicate Key
    if (err.code === 11000) {
        err.statusCode = 400;
        message = `Duplicate field value entered. Please use another value.`;
    }

    // Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
        err.statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: message,
            stack: err.stack
        });
    } else {
        res.status(err.statusCode).json({
            status: err.status,
            message: message
        });
    }
};
