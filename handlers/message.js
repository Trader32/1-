const bot = require('../config/bot');
const Fuse = require('fuse.js');

const {
    User,
    FAQ,
    Ticket,
    Message
} = require('../models');

const {
    getState,
    clearState
} = require('../services/stateService');

const {
    getFAQMenu
} = require('../keyboards');

bot.on('message', async (msg) => {

    const chatId = msg.chat.id;
    const text = msg.text;

    const hasContent =
        msg.text ||
        msg.photo ||
        msg.document ||
        msg.video ||
        msg.audio;

    if (!hasContent) return;

    const state = getState(chatId);

    if (!state) return;

    if (state.state === 'SEARCH_FAQ') {

        const faqList = await FAQ.findAll();

        const fuse = new Fuse(faqList, {
            keys: ['question', 'answer'],
            threshold: 0.4
        });

        const results = fuse.search(text);

        if (results.length === 0) {
            return bot.sendMessage(
                chatId,
                'Ничего не найдено'
            );
        }

        const faq = results[0].item;

        clearState(chatId);

        return bot.sendMessage(
            chatId,
            `Вопрос:\n${faq.question}\n\nОтвет:\n${faq.answer}`,
            getFAQMenu()
        );
    }

    if (state.state === 'FAQ_SECTIONS') {

        const faqList = await FAQ.findAll({
            where: {
                section: text
            }
        });

        if (faqList.length === 0) {
            return bot.sendMessage(
                chatId,
                'Раздел пуст.'
            );
        }

        const questions = faqList
            .map(item => item.question)
            .join('\n\n');

        clearState(chatId);

        return bot.sendMessage(
            chatId,
            questions,
            getFAQMenu()
        );
    }
    if (state.state === 'FEEDBACK') {

        let fileId = null;
        let fileType = null;

        if (msg.photo) {
            fileId = msg.photo.pop().file_id;
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

        const user = await User.findByPk(chatId);

        if (user) {
            user.lastMessage = new Date();
            await user.save();
        }

        let ticket = await Ticket.findOne({
            where: {
                UserTelegramId: chatId,
                status: 'open'
            }
        });

        if (!ticket) {

            ticket = await Ticket.create({
                UserTelegramId: chatId,
                status: 'open'
            });

            const admins = await User.findAll({
                where: {
                    role: 1
                }
            });

            for (const admin of admins) {
                await bot.sendMessage(
                    admin.telegramId,
                    `Поступила новая заявка №${ticket.id}`
                );
            }
        }

        await Message.create({
            text: msg.text || null,
            fileId,
            fileType,
            TicketId: ticket.id
        });

        return bot.sendMessage(
            chatId,
            'Заявка получена! Сообщение сохранено.'
        );
    }

});