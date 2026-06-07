const express = require('express');
const db = require('./db');

const app = express();

app.get('/', (req, res) => {res.send('<h1>Привет, Октагон!</h1>');});

app.get('/static', (req, res) => {res.json({
        header: 'Hello',
        body: 'Octagon NodeJS Test'
    });});

app.get('/dynamic', (req, res) => {

    const a = Number(req.query.a);
    const b = Number(req.query.b);
    const c = Number(req.query.c);

    if (isNaN(a) || isNaN(b) || isNaN(c)) 
        {return res.json({header: 'Error'});}

    const result = (a * b * c) / 3;

    res.json({
        header: 'Calculated',
        body: String(result)
    });
});

app.get('/getAllItems', (req, res) => {

    db.query(
        'SELECT * FROM Items',
        (err, results) => {

            if (err) {return res.json(null);}
            res.json(results);
        });
    });

app.post('/addItem', (req, res) => {

    const name = req.query.name;
    const desc = req.query.desc;

    if (!name || !desc) {
        return res.json(null);}

    db.query(
        'INSERT INTO Items(name, `desc`) VALUES (?, ?)',
        [name, desc],
        (err, result) => {
            if (err) {return res.json(null);}

            db.query(
                'SELECT * FROM Items WHERE id = ?',
                [result.insertId],
                (err, rows) => {

                    if (err) {return res.json(null);}

                    res.json(rows[0]);
                });
            });
        });

app.post('/deleteItem', (req, res) => {
    const id = Number(req.query.id);

    if (!id) {return res.json(null);}

    db.query(
        'DELETE FROM Items WHERE id = ?',
        [id],
        (err, result) => {

            if (err) {return res.json(null);}

            if (result.affectedRows === 0) {return res.json({});}

            res.json({
                deleted: true
            });
        });
    });

app.post('/updateItem', (req, res) => {

    const id = Number(req.query.id);
    const name = req.query.name;
    const desc = req.query.desc;

    if (!id || !name || !desc) {return res.json(null);}

    db.query(
        'UPDATE Items SET name=?, `desc`=? WHERE id=?',
        [name, desc, id],
        (err, result) => {

            if (err) {return res.json(null);}

            if (result.affectedRows === 0) {return res.json({});}

            db.query(
                'SELECT * FROM Items WHERE id=?',
                [id],
                (err, rows) => {

                    if (err) {
                        return res.json(null);
                    }

                    res.json(rows[0]);
                });
            });
        });

app.listen(3000, () => {console.log('Сервер запущен на порту 3000');});
