const bot = require('../config/bot');
const { User } = require('../models');

bot.onText(/Посмотреть заявки/, async (msg) => {

    const user = await User.findByPk(msg.chat.id);

    if (!user || user.role !== 1) {
        return bot.sendMessage(
            msg.chat.id,
            'Нет доступа'
        );
    }

    bot.sendMessage(
        msg.chat.id,
        'Раздел администратора'
    );

});