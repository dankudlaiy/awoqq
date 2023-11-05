const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const streamToBuffer = require('stream-to-buffer');

require('dotenv').config();

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log('bot is running');

const userStates = {};

const admin_keyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'Add octo', callback_data: 'add_octo_button' }],
            [{ text: 'Show octos', callback_data: 'show_octos_button' }]
        ]
    }
};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    const user = {
        chat_id: chatId,
        balance: 0,
        role: 'user'
    };

    axios.post('http://localhost:3000/user/', user)
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.log('user chat id ' + chatId + ' already exists in database');
        });

    bot.sendMessage(chatId, 'Welcome to octo-store!');
    bot.sendMessage(chatId, 'Admin menu', admin_keyboard);
});

bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const action = callbackQuery.data;

    if (action === 'add_octo_button') {
        bot.sendMessage(chatId, 'Name for your new octo?');

        userStates[chatId] = { state: 'awaitingNewOctoNameInput', inputs: {} };
    }

    if (action === 'show_octos_button') {
        axios.get('http://localhost:3000/products/')
            .then((response) => {
                const octos = response.data;

                octos.forEach((octo) => {
                    const photo = Buffer.from(octo.photo, 'base64');

                    bot.sendPhoto(chatId, photo, { caption: `${octo.name}, ${octo.price}` });
                });

                bot.sendMessage(chatId, 'Admin menu', admin_keyboard);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userInput = msg.text;

    let currentState = 'default';

    try{
        currentState = userStates[chatId].state;
    } catch (error) {}

    if (currentState === 'awaitingNewOctoNameInput') {
        userStates[chatId].inputs[0] = userInput;
        bot.sendMessage(chatId, `New octo name is: ${userInput}. And what is the price?`);

        userStates[chatId].state = 'awaitingNewOctoPriceInput';
    }

    if(currentState === 'awaitingNewOctoPriceInput') {
        if(isNaN(userInput)) {
            bot.sendMessage(chatId, 'Please send correct number. Price?');
            return;
        }

        userStates[chatId].inputs[1] = userInput;
        userStates[chatId].state = 'awaitingNewOctoPhotoInput';

        bot.sendMessage(chatId, 'Now upload photo of your new octo');
    }
});

bot.on('photo', async(msg) => {
    const chatId = msg.chat.id;

    let currentState = 'default';

    try{
        currentState = userStates[chatId].state;
    } catch (error) {}

    if(currentState === 'awaitingNewOctoPhotoInput') {
        const photo = msg.photo[1];

        const photoFileId = photo.file_id;

        const fileLink = await bot.getFileLink(photoFileId);

        const arrayBuffer = await (await fetch(fileLink)).arrayBuffer();

        const buffer = Buffer.from(arrayBuffer);

        const octo = {
            name: userStates[chatId].inputs[0],
            price: userStates[chatId].inputs[1],
            photo: buffer
        };

        axios.post('http://localhost:3000/products/', octo)
            .then((response) => {
                bot.sendMessage(chatId, 'Your octo was successfully  created!');
                console.log(response.data);
            })
            .catch((error) => {
                bot.sendMessage(chatId, 'An error occurred while trying to create your octo.')
                console.log(error.message);
            });

        bot.sendMessage(chatId, 'Admin menu', admin_keyboard);

        delete userStates[chatId];
    }
});