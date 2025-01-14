module.exports.errorInfo = (status, message) => {
    const err = new Error();
    err.status = status;
    err.message = message;
    return err;
};

module.exports.errorHandler = (err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Internal Server Error";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    });
};
