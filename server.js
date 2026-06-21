require('dotenv').config();

const express = require('express');
const app = express();

const apiRoutes = require('./routes/api');

app.use(express.json());

app.use('/', apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});