const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Message = sequelize.define('Message', {
    text: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    fileId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fileType: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Message;