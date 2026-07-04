const bot = require('../config/bot');

const { setState } = require('../services/stateService');

const { getCancelKeyboard } = require('../keyboards');

bot.onText(/Обратная связь/, async (msg) => {

    setState(
        msg.chat.id,
        {
            state: 'FEEDBACK'
        }
    );

    bot.sendMessage(
        msg.chat.id,
        'Опишите проблему или отправьте файл',
        getCancelKeyboard()
    );

});