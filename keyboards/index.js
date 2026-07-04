function getMainMenu(isAdmin = false) {

    const keyboard = [
        [{ text: 'FAQ' }],
        [{ text: 'Обратная связь' }]
    ];

    if (isAdmin) {
        keyboard.push([
            { text: 'Посмотреть заявки' }
        ]);
    }

    return {
        reply_markup: {
            keyboard,
            resize_keyboard: true
        }
    };
}

function getFAQMenu() {
    return {
        reply_markup: {
            keyboard: [
                [{ text: 'Поиск по слову' }],
                [{ text: 'Поиск по разделам' }],
                [{ text: 'Главное меню' }]
            ],
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
                [{ text: 'Назад' }]
            ],
            resize_keyboard: true
        }
    };
}

function getBackKeyboard() {
    return {
        reply_markup: {
            keyboard: [
                [{ text: 'Назад' }],
                [{ text: 'Главное меню' }]
            ],
            resize_keyboard: true
        }
    };
}

function getCancelKeyboard() {
    return {
        reply_markup: {
            keyboard: [
                [{ text: 'Отмена' }]
            ],
            resize_keyboard: true
        }
    };
}

module.exports = {
    getMainMenu,
    getFAQMenu,
    getSectionsKeyboard,
    getBackKeyboard,
    getCancelKeyboard
};