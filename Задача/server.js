const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Привет, Октагон!</h1>');
});

app.get('/static', (req, res) => {
    res.json({
        header: 'Hello',
        body: 'Octagon NodeJS Test'
    });
});

app.get('/dynamic', (req, res) => {

    const a = Number(req.query.a);
    const b = Number(req.query.b);
    const c = Number(req.query.c);

    if (
        isNaN(a) ||
        isNaN(b) ||
        isNaN(c)
    ) {
        return res.json({
            header: 'Error'
        });
    }

    const result = (a * b * c) / 3;

    res.json({
        header: 'Calculated',
        body: String(result)
    });
});

app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
