const express = require('express');
const router = express.Router();

const {
    User,
    FAQ,
    Ticket,
    Message
} = require('../models');

router.get('/', (req, res) => {
    res.json({
        message: 'API works'
    });
});

router.get('/users', async (req, res) => {

    const users = await User.findAll();

    res.json(users);

});

router.get('/faq', async (req, res) => {

    const faq = await FAQ.findAll();

    res.json(faq);

});

router.get('/tickets', async (req, res) => {

    const tickets = await Ticket.findAll({
        include: Message
    });

    res.json(tickets);

});

module.exports = router;