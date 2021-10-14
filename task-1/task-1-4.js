const express = require('express'),
    http = require('http');

var app = express();

const PORT = 8080;

// app.use(express.json());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.message);
});

app.get('/hello', (req, res) => {
    var body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      res.status(200).json(body);
      res.end();
    });
});

var server = app.listen(PORT);