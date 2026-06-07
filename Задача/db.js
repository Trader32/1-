const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ChatBotTests'
});

connection.connect((err) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log('MySQL connected');
});

module.exports = connection;
