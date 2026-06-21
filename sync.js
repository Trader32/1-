const sequelize = require('./database');
require('./models');

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((error) => {
        console.log(error);
    });