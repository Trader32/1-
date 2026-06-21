const User = require('./User');
const FAQ = require('./FAQ');
const Ticket = require('./Ticket');
const Message = require('./Message');

User.hasMany(Ticket, {
    foreignKey: 'UserTelegramId'
});

Ticket.belongsTo(User, {
    foreignKey: 'UserTelegramId',
    targetKey: 'telegramId'
});

Ticket.hasMany(Message);
Message.belongsTo(Ticket);

module.exports = {
    User,
    FAQ,
    Ticket,
    Message
};