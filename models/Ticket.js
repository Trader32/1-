const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Ticket = sequelize.define('Ticket', {
    status: {
        type: DataTypes.STRING,
        defaultValue: 'open'
    }
});

module.exports = Ticket;