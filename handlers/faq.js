const bot = require('../config/bot');

const {
    setState
} = require('../services/stateService');

const {
    getCancelKeyboard,
    getSectionsKeyboard
} = require('../keyboards');

bot.onText(/Поиск по слову/, async (msg) => {

    setState(
        msg.chat.id,
        {
            state: 'SEARCH_FAQ'
        }
    );

    bot.sendMessage(
        msg.chat.id,
        'Введите ключевое слово',
        getCancelKeyboard()
    );

});

bot.onText(/Поиск по разделам/, async (msg) => {

    setState(
        msg.chat.id,
        {
            state: 'FAQ_SECTIONS'
        }
    );

    bot.sendMessage(
        msg.chat.id,
        'Выберите раздел',
        getSectionsKeyboard()
    );

});