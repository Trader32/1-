const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Привет, Октагон!</h1>');
});

app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
