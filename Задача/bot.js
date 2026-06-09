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
