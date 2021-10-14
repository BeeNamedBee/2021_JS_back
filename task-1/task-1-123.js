const express = require('express'),

var app = express();

const PORT = 8080;

app.use(express.json());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.message);
});

app.get('/sum', (req, res) => {
    let a = parseInt(req.query.a);
    let b = parseInt(req.query.b);
    if (isNaN(a) || isNaN(b))
        return res.sendStatus(400);
    return res.status(200).json(a + b);
});

app.get('/reverseCase', (req, res) => {
    let str = String(req.query.str);
    let out = '';
    if (typeof str === 'undefined')
        return res.sendStatus(400);
    for (i = 0; i < str.length; ++i)
    {
        let ch = str.charAt(i);
        if (ch === ch.toUpperCase())
            out += ch.toLowerCase();
        else
            out += ch.toUpperCase();
    }
    return res.status(200).json(out);
});

app.get('/reverseArray', (req, res) => {
    let arr = req.body.array;
    if (Array.isArray(arr))
        return res.status(200).json(arr.reverse());
    return res.sendStatus(400);
});

var server = app.listen(PORT);