const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
    telegramId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false
    },
    role: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lastMessage: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

module.exports = User;