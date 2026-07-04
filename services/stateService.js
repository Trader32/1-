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

module.exports = {
    setState,
    getState,
    clearState
};