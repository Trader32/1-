const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const FAQ = sequelize.define('FAQ', {
    question: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    answer: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    section: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = FAQ;