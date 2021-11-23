const { Router } = require('express');
const ErrorResponse = require('../classes/error-response');
const User = require('../database/models/User.model');
const { asyncHandler, requireToken } = require('../middlewares/middlewares');

const router = Router();

function initRoutes() {
	router.get('/me', asyncHandler(requireToken), asyncHandler(getMe));
	router.patch('/me', asyncHandler(requireToken), asyncHandler(updateMe));
	router.post('/logout', asyncHandler(requireToken), asyncHandler(logout));
}

async function getMe(req, res, next) {
	const check = await User.findOne({ where: { id: req.token.userId } });
	res.status(200).json(check);
}

async function updateMe(req, res, next) {
	const check = await User.findOne({ where: { id: req.token.userId } });
	if (!check)
		throw new ErrorResponse('No such user', 404);
	await check.update(req.body);
	res.status(200).json(check);
}

async function logout(req, res, next) {
	await req.token.destroy();
	res.sendStatus(200);
}

initRoutes();

module.exports = router;
