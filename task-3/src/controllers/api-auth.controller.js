const { Router } = require('express');
const { Op } = require('sequelize');
const ErrorResponse = require('../classes/error-response');
const User = require('../database/models/User.model.js');
const Token = require('../database/models/Token.model');
const { asyncHandler } = require('../middlewares/middlewares');

const router = Router();

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

function initRoutes() {
	router.post('/registration', asyncHandler(register));
	router.post('/login', asyncHandler(auth));
}

async function register(req, res, next) {
	const check = await User.findOne({
		where: {
			[Op.or]:{
				email: req.body.email,
				login: req.body.login,
			}
		},
	});
	if (check)
		throw new ErrorResponse('Email or login in use', 400);
	const user = await User.create(req.body);
	res.status(200).json(user);
}

async function auth(req, res, next) {
	const check = await User.findOne({
		where: {
			login: req.body.login,
			password: req.body.password,
		},
	});
	if (!check)
		throw new ErrorResponse('No such user', 404)
	const token = makeid(192);
	await Token.create({ userId: check.id, value: token});
	res.status(200).json({ token: token });
}

initRoutes();

module.exports = router;
