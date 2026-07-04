const bot = require('../config/bot');
const { User } = require('../models');

const { clearState } = require('../services/stateService');

const {
    getMainMenu,
    getFAQMenu
} = require('../keyboards');

bot.onText(/FAQ/, async (msg) => {

    clearState(msg.chat.id);

    bot.sendMessage(
        msg.chat.id,
        'Выберите режим FAQ',
        getFAQMenu()
    );

});

bot.onText(/Главное меню/, async (msg) => {

    const chatId = msg.chat.id;

    clearState(chatId);

    const user = await User.findByPk(chatId);

    bot.sendMessage(
        chatId,
        'Главное меню',
        getMainMenu(user?.role === 1)
    );

});

bot.onText(/Отмена/, async (msg) => {

    const chatId = msg.chat.id;

    clearState(chatId);

    const user = await User.findByPk(chatId);

    bot.sendMessage(
        chatId,
        'Действие отменено',
        getMainMenu(user?.role === 1)
    );

});

bot.onText(/Назад/, async (msg) => {

    clearState(msg.chat.id);

    bot.sendMessage(
        msg.chat.id,
        'Выберите режим FAQ',
        getFAQMenu()
    );

});