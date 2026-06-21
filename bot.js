require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const Fuse = require('fuse.js');
const cron = require('node-cron');

const { User, FAQ, Ticket, Message } = require('./models');

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

const states = {};

function setState(chatId, data) {
    states[chatId] = data;
}

function getState(chatId) {
    return states[chatId];
}

function clearState(chatId) {
    delete states[chatId];
}

function getMainMenu(isAdmin = false) {
    const keyboard = [
        [{ text: ' FAQ' }],
        [{ text: ' Обратная связь' }]
    ];

    if (isAdmin) {
        keyboard.push([{ text: ' Посмотреть заявки' }]);
        keyboard.push([{ text: ' Рассылка' }]);
    }

    return {
        reply_markup: { keyboard, resize_keyboard: true }
    };
}

function getFAQMenu() {
    return {
        reply_markup: {
            keyboard: [
                [{ text: ' Поиск по слову' }],
                [{ text: ' Поиск по разделам' }],
                [{ text: ' Главное меню' }]
            ],
            resize_keyboard: true
        }
    };
}

function getCancelKeyboard() {
    return {
        reply_markup: {
            keyboard: [[{ text: ' Отмена' }]],
            resize_keyboard: true
        }
    };
}

function getSectionsKeyboard() {
    return {
        reply_markup: {
            keyboard: [
                [{ text: 'Компетенции' }],
                [{ text: 'Практики' }],
                [{ text: 'Контакты' }],
                [{ text: 'Спринты' }],
                [{ text: 'Октокоины' }],
                [{ text: ' Назад' }]
            ],
            resize_keyboard: true
        }
    };
}

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
        'Добро пожаловать в Октагон!',
        getMainMenu(user.role === 1)
    );
});

bot.onText(/ FAQ/, async (msg) => {
    const chatId = msg.chat.id;
    clearState(chatId);

    bot.sendMessage(chatId, 'Выберите режим FAQ', getFAQMenu());
});

bot.onText(/ Поиск по слову/, async (msg) => {
    const chatId = msg.chat.id;
    setState(chatId, { state: 'SEARCH_FAQ' });

    bot.sendMessage(chatId, 'Введите ключевое слово', getCancelKeyboard());
});

bot.onText(/ Поиск по разделам/, async (msg) => {
    const chatId = msg.chat.id;
    setState(chatId, { state: 'FAQ_SECTIONS' });

    bot.sendMessage(chatId, 'Выберите раздел', getSectionsKeyboard());
});

bot.onText(/ Обратная связь/, async (msg) => {
    const chatId = msg.chat.id;

    setState(chatId, { state: 'FEEDBACK' });

    let user = await User.findByPk(chatId);
    if (user) {
        user.lastMessage = new Date();
        await user.save();
    }

    bot.sendMessage(chatId, 'Опишите проблему (можно отправить файл)', getCancelKeyboard());
});

bot.onText(/ Посмотреть заявки/, async (msg) => {
    const chatId = msg.chat.id;

    const user = await User.findByPk(chatId);
    if (!user || user.role !== 1) return bot.sendMessage(chatId, 'Нет доступа');

    const tickets = await Ticket.findAll({
        where: { status: 'open' },
        order: [['id', 'DESC']],
        limit: 10
    });

    if (!tickets.length) return bot.sendMessage(chatId, 'Нет заявок');

    const keyboard = tickets.map(t => [{ text: `#${t.id} - заявка` }]);

    bot.sendMessage(chatId, 'Заявки:', {
        reply_markup: { keyboard, resize_keyboard: true }
    });
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const state = getState(chatId);

    if (!state) return;

    if (state.state === 'SEARCH_FAQ') {
        const faqList = await FAQ.findAll();

        const fuse = new Fuse(faqList, {
            keys: ['question', 'answer'],
            threshold: 0.4
        });

        const results = fuse.search(text || '');

        if (!results.length) {
            return bot.sendMessage(chatId, 'Ничего не найдено');
        }

        clearState(chatId);

        const faq = results[0].item;

        return bot.sendMessage(
            chatId,
            ` ${faq.question}\n\n ${faq.answer}`,
            getFAQMenu()
        );
    }

    if (state.state === 'FAQ_SECTIONS') {
        const faqList = await FAQ.findAll({
            where: { section: text }
        });

        if (!faqList.length) {
            return bot.sendMessage(chatId, 'Пусто');
        }

        const keyboard = faqList.map(q => [{ text: q.question }]);
        keyboard.push([{ text: ' Назад' }]);

        return bot.sendMessage(chatId, 'Выберите вопрос', {
            reply_markup: { keyboard, resize_keyboard: true }
        });
    }

    if (state.state === 'FEEDBACK') {
        let fileId = null;
        let fileType = null;

        if (msg.photo) {
            fileId = msg.photo.at(-1).file_id;
            fileType = 'photo';
        }
        if (msg.document) {
            fileId = msg.document.file_id;
            fileType = 'document';
        }
        if (msg.video) {
            fileId = msg.video.file_id;
            fileType = 'video';
        }
        if (msg.audio) {
            fileId = msg.audio.file_id;
            fileType = 'audio';
        }

        let user = await User.findByPk(chatId);
        if (user) {
            user.lastMessage = new Date();
            await user.save();
        }

        let ticket = await Ticket.findOne({
            where: { UserTelegramId: chatId, status: 'open' }
        });

        if (!ticket) {
            ticket = await Ticket.create({
                UserTelegramId: chatId,
                status: 'open'
            });

            const admins = await User.findAll({ where: { role: 1 } });

            for (const admin of admins) {
                bot.sendMessage(admin.telegramId, ` Новая заявка #${ticket.id}`);
            }
        }

        await Message.create({
            text: msg.text || null,
            fileId,
            fileType,
            TicketId: ticket.id
        });

        return bot.sendMessage(chatId, 'Сообщение добавлено');
    }

    if (text && text.startsWith('#')) {
        const user = await User.findByPk(chatId);
        if (!user || user.role !== 1) return;

        const ticketId = Number(text.replace('#', '').split(' ')[0]);
        const ticket = await Ticket.findByPk(ticketId);

        if (!ticket) return bot.sendMessage(chatId, 'Не найдено');

        setState(chatId, {
            state: 'ADMIN_REPLY',
            ticketId
        });

        return bot.sendMessage(chatId, `Ответ в заявку #${ticketId}`, getCancelKeyboard());
    }

    if (state.state === 'ADMIN_REPLY') {
        const ticket = await Ticket.findByPk(state.ticketId);
        if (!ticket) return bot.sendMessage(chatId, 'Заявка не найдена');

        const userId = ticket.UserTelegramId;

        if (text) {
            await bot.sendMessage(userId, ` Ответ:\n${text}`);
        }

        return bot.sendMessage(chatId, 'Отправлено');
    }

    if (state.state === 'BROADCAST') {
        const users = await User.findAll();

        for (const u of users) {
            try {
                if (text) {
                    await bot.sendMessage(u.telegramId, ` ${text}`);
                }
            } catch (e) {}
        }

        clearState(chatId);
        return bot.sendMessage(chatId, 'Рассылка завершена');
    }
});

bot.onText(/ Назад/, (msg) => {
    const chatId = msg.chat.id;
    clearState(chatId);
    bot.sendMessage(chatId, 'Назад', getFAQMenu());
});

bot.onText(/ Главное меню/, async (msg) => {
    const chatId = msg.chat.id;

    clearState(chatId);

    const user = await User.findByPk(chatId);

    bot.sendMessage(chatId, 'Главное меню', getMainMenu(user?.role === 1));
});

bot.onText(/ Отмена/, (msg) => {
    const chatId = msg.chat.id;
    clearState(chatId);
    bot.sendMessage(chatId, 'Отменено', getMainMenu(false));
});

cron.schedule('0 12 * * *', async () => {
    const now = new Date();
    const users = await User.findAll();

    for (const user of users) {
        const last = new Date(user.lastMessage || 0);
        const diff = (now - last) / 86400000;

        if (diff >= 3) {
            try {
                await bot.sendMessage(user.telegramId,
                    ' Вы давно не заходили в Октагон'
                );
            } catch {}
        }
    }
});

cron.schedule('0 10 * * MON', async () => {
    const users = await User.findAll();

    for (const u of users) {
        try {
            await bot.sendMessage(u.telegramId, ' Новый спринт начался!');
        } catch {}
    }
});

bot.on('polling_error', err => {
    console.log(err.message);
});