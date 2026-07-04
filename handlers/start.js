const bot = require('../config/bot');
const { User } = require('../models');

const { clearState } = require('../services/stateService');
const { getMainMenu } = require('../keyboards');

bot.onText(/\/start/, async (msg) => {

    const chatId = msg.chat.id;

    let user = await User.findByPk(chatId);

    if (!user) {
        user = await User.create({
            telegramId: chatId,
            role: 0,
            lastMessage: new Date()
        });
    }

    clearState(chatId);

    bot.sendMessage(
        chatId,
        'Добро пожаловать в чат-бот Октагон!',
        getMainMenu(user.role === 1)
    );

});