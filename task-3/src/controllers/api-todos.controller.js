const { Router } = require('express');
const ErrorResponse = require('../classes/error-response');
const ToDo = require('../database/models/ToDo.model');
const { asyncHandler, requireToken } = require('../middlewares/middlewares');

const router = Router();

function initRoutes() {
    router.get('/', asyncHandler(requireToken), asyncHandler(getToDos));
	router.post('/', asyncHandler(requireToken), asyncHandler(createToDo));
	router.delete('/', asyncHandler(requireToken), asyncHandler(deleteToDos));
    router.get('/:id', asyncHandler(requireToken), asyncHandler(getToDoById));
    router.patch('/:id', asyncHandler(requireToken), asyncHandler(updateToDoById));
    router.delete('/:id', asyncHandler(requireToken), asyncHandler(deleteToDoById));
}

async function getToDos(req, res, next) {
    const todos = await ToDo.findAll({where: { userId: req.token.userId } });

    res.status(200).json({ todos });
}

async function getToDoById(req, res, next) {
	console.log(typeof(req.params.id));
	console.log(typeof(req.token.userId));
    const todo = await ToDo.findOne({ where: { userId: req.token.userId, id: req.params.id }});
    if (!todo) {
        throw new ErrorResponse('No todo found', 404);
    }
    res.status(200).json(todo);
}

async function createToDo(req, res, next) {
	const { title, description, isComplete, isFavourite, priority } = req.body;
	const userId = req.token.userId;

	const td = await ToDo.create({
		userId,
		title,
		description,
		isComplete,
		isFavourite,
		priority
	});

	if (!td)
		throw new ErrorResponse('Internal error', 500);
	
    res.status(200).json(td);
}

async function deleteToDos(req, res, next) {
	await ToDo.destroy({
		where: {
			userId: req.token.userId,
		},
	});

	res.sendStatus(200);
}

async function updateToDoById(req, res, next) {
	const todo = await ToDo.findOne({ where: { userId: req.token.userId, id: req.params.id }});

	if (!todo)
		throw new ErrorResponse('No todo with this id', 404);

	await todo.update(req.body);
    res.status(200).json(todo);
}

async function deleteToDoById(req, res, next) {
	const todo = await ToDo.findOne({ where: { userId: req.token.userId, id: req.params.id }});
	if (!todo)
		throw new ErrorResponse('No todo with this id', 404);
	await todo.destroy();
	res.sendStatus(200);
}

initRoutes();

module.exports = router;
