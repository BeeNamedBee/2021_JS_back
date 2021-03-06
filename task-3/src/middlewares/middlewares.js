const ErrorResponse = require('../classes/error-response');
const Token = require('../database/models/Token.model');

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const syncHandler = (fn) => (req, res, next) => {
    try {
        fn(req, res, next);
    } catch (error) {
        next(error);
    }
};

const notFound = (req, _res, next) => {
    next(new ErrorResponse(`Not found - ${req.originalUrl}`, 404));
};

const errorHandler = (err, _req, res, _next) => {
    console.log('Ошибка', {
        message: err.message,
        stack: err.stack,
    });
    res.status(err.code || 500).json({
        message: err.message
    });
};

const requireToken = async (req, res, next) => {
	const tok = req.get('x-access-token');
	console.log(`TOKEN: ${tok}`);
	if (!tok)
		throw new ErrorResponse('No token send', 400);
	const dbtok = await Token.findOne({ where: {value: tok } });
	if (!dbtok)
		throw new ErrorResponse('Invalid token', 401);
	req.token = dbtok;
	next();
};

module.exports = {
    asyncHandler,
    syncHandler,
    notFound,
    errorHandler,
	requireToken
};
