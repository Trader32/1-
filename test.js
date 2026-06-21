const sequelize = require('./database');

sequelize.authenticate()
    .then(() => {
        console.log('MySQL connected');
    })
    .catch((error) => {
        console.log(error);
    });