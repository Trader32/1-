require('./models');

const bot = require('./config/bot');

require('./handlers/start');
require('./handlers/menu');
require('./handlers/faq');
require('./handlers/feedback');
require('./handlers/admin');
require('./handlers/message');

require('./services/cronService');

bot.on('polling_error', (err) => {
    console.log(err.message);
});

console.log('Bot started');
