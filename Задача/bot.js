const TelegramBot = require('node-telegram-bot-api');
const db = require('./db');
const token = '8884568281:AAFVN0Y-e4UjTuFaZqXiZqTcejbDsF6rjAY';
const bot = new TelegramBot(token, {
    polling: true
});
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        'Привет, Октагон!'
    );
});
bot.onText(/\/help/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        '/site - сайт Октагон\n' +
        '/creator - создатель\n' +
        '/randomItem - случайный предмет\n' +
        '/getItemByID ID - получить предмет\n' +
        '/deleteItem ID - удалить предмет'
    );
});
bot.onText(/\/site/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        'https://octagon-students.ru/'
    );
});
bot.onText(/\/creator/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        'Пронин Максим Дмитриевич'
    );
});
bot.onText(/\/randomItem/, (msg) => {
    db.query(
        'SELECT * FROM items ORDER BY RAND() LIMIT 1',
        (err, rows) => {

            if (err || rows.length === 0) {
                return bot.sendMessage(
                    msg.chat.id,
                    'Ошибка'
                );
            }
            const item = rows[0];
            bot.sendMessage(
                msg.chat.id,
                `(${item.id}) - ${item.name}: ${item.desc}`
            );}
    );
});

bot.onText(/\/getItemByID (.+)/, (msg, match) => {
    const id = Number(match[1]);
    db.query(
        'SELECT * FROM items WHERE id = ?',
        [id],
        (err, rows) => {

            if (err || rows.length === 0) {
                return bot.sendMessage(
                    msg.chat.id,
                    'Ошибка'
                );
            }
            const item = rows[0];
            bot.sendMessage(
                msg.chat.id,
                `(${item.id}) - ${item.name}: ${item.desc}`
            );}
    );
});

bot.onText(/\/deleteItem (.+)/, (msg, match) => {
    const id = Number(match[1]);
    db.query(
        'DELETE FROM items WHERE id = ?',
        [id],
        (err, result) => {

            if (err) {
                return bot.sendMessage(
                    msg.chat.id,
                    'Ошибка'
                );
            }
            if (result.affectedRows === 0) {
                return bot.sendMessage(
                    msg.chat.id,
                    'Ошибка'
                );
            }
            bot.sendMessage(
                msg.chat.id,
                'Удачно'
            );
        }
    );

});
