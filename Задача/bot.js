const TelegramBot = require('node-telegram-bot-api');
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
        '/creator - информация о создателе'
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
        'Матюхин Тимур Васильевич'
    );
});
