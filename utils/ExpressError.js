class ExpressError extends Error{
    constructor(statusCode, message){
        supper();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;