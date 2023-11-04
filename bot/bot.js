const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

require('dotenv').config();

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log('bot is running')

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'your chat id:' + chatId);

    const user = {
        chat_id: chatId,
        balance: 0,
        role: 'user'
    };

    axios.post('http://localhost:3000/user/', user)
        .then((response) => {
            console.log(response.data);
            bot.sendMessage(chatId, 'you have been added to database!');
        })
        .catch((error) => {
            console.error(`Error: ${error.message}`);
            bot.sendMessage(chatId, 'error raised while trying to add you to database!');
        });
});


bot.onText(/\/photo/, (msg) => {
    const chatId = msg.chat.id;

    // Replace 'path/to/your/photo.jpg' with the actual path to your photo NOT WORKING FOR SOME REASON
    const photoPath = path.join(__dirname, 'C:/Users/kxd/WebstormProjects/octo-store/bot/cats.png');

    // Send the photo
    bot.sendPhoto(chatId, photoPath, { caption: 'Cute cats < 3' })
        .then(() => {
            console.log('Photo sent successfully');
        })
        .catch((error) => {
            console.error('Error sending photo:', error.message);
        });
});