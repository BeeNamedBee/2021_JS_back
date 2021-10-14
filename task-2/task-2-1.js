const { Sequelize, ValidationError } = require('sequelize');
const express = require('express');
const { type } = require('os');
const sequelize = new Sequelize('postgres://postgres:postgres@127.0.0.1:5432/2021jspractice')

const PORT = 8080;

var app = express();

var ToDo = sequelize.define('ToDo', {
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
});

app.use(express.json());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.message);
});

app.get('/todo', async (req, res) => {
    var tmp = await ToDo.findAll();
    return res.status(200).json(tmp);
});

app.delete('/todo', (req, res) => {
    let id = parseInt(req.body.id);
    if (isNaN(id))
        return res.sendStatus(400);
    ToDo.destroy({
        where: {
            id: id
        }
    });
    return res.sendStatus(200);
});

app.put('/todo', (req, res) => {
    let id = parseInt(req.body.id);
    let title = req.body.title;
    let desc = req.body.description;
    if (typeof title === 'undefined'
        || typeof desc === 'undefined'
        || isNaN(id))
        return res.sendStatus(400);
    ToDo.update({title: title, description: desc}, {
        where: {
            id: id
        }
    });
    return res.sendStatus(200);
});

app.post('/todo', (req, res) => {
    let title = req.body.title;
    let desc = req.body.description;
    if (typeof title === 'undefined'
        || typeof desc === 'undefined')
        return res.sendStatus(400);
    ToDo.create({title: title, description: desc})
        .catch(Sequelize.ValidationError, (err) => {
            console.log(err);
        });
    return res.sendStatus(200);
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        ToDo.sync();
        app.listen(PORT);
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
})();