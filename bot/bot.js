process.env.NTBA_FIX_319 = '1';
process.env.NTBA_FIX_350 = '0';

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

require('dotenv').config();

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log('bot is running');

const userStates = {};

const userRoles = {};

const msgs = new Map();

const admin_keyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'Add octo', callback_data: 'add_octo_button' }],
            [{ text: 'Show octos', callback_data: 'show_admin_octos_button' }],
            [{ text: 'Show users', callback_data: 'show_users_button' }]
        ]
    }
};

const user_keyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'Store', callback_data: 'show_octos_button' }],
            [{ text: 'Inventory', callback_data: 'show_owned_octos' }]
        ]
    }
};

axios.get('http://localhost:3000/users/')
    .then((response) => {
        const users = response.data;

        users.forEach((user) => {
            userRoles[user.chat_id] = user.role;
        });
    })
    .catch((error) => {
        console.log(error.message);
    });

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
        .catch(() => {
            console.log('user chat id ' + chatId + ' already exists in database');
        });

    bot.sendMessage(chatId, 'Welcome to octo-store!');

    if(userRoles[chatId] === 'user') {
        bot.sendMessage(chatId, 'Menu', user_keyboard);
    }

    if(userRoles[chatId] === 'admin') {
        bot.sendMessage(chatId, 'Admin menu', admin_keyboard);
    }
});

bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const action = callbackQuery.data;

    if (action === 'add_octo_button') {
        bot.sendMessage(chatId, 'Name for your new octo?');

        userStates[chatId] = { state: 'awaitingNewOctoNameInput', inputs: {} };
    }

    if (action === 'show_admin_octos_button') {
        axios.get('http://localhost:3000/products/')
            .then((response) => {
                const octos = response.data;

                octos.forEach((octo, index) => {
                    setTimeout(() => {
                        const photo = Buffer.from(octo.photo, 'base64');

                        const id = octo._id;

                        bot.sendPhoto(chatId, photo,
                            {
                                caption: `${octo.name}, ${octo.price}`,
                                reply_markup: {
                                    inline_keyboard: [[{ text: 'Remove', callback_data: `remove_octo${chatId}:${id}`}]]
                                }
                            })
                            .then((sentMessage) => {
                                msgs[`${chatId}:${id}`] = sentMessage.message_id;
                            });
                    }, index * 1000);
                });

                setTimeout(() => {
                    bot.sendMessage(chatId, 'Admin menu', admin_keyboard);
                }, octos.length * 1000);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    if(action === 'show_octos_button') {
        axios.get('http://localhost:3000/products/')
            .then((response) => {
                const octos = response.data;

                octos.forEach((octo, index) => {
                    setTimeout(() => {
                        const photo = Buffer.from(octo.photo, 'base64');

                        const id = octo._id;

                        bot.sendPhoto(chatId, photo,
                            {
                                caption: `${octo.name}, ${octo.price}`,
                                reply_markup: {
                                    inline_keyboard: [[{ text: 'buy?', callback_data: `buy_octo${chatId}:${id}`}]]
                                }
                            })
                            .then((sentMessage) => {
                                msgs[`${chatId}:${id}`] = sentMessage.message_id;
                            });
                    }, index * 1000);
                });

                setTimeout(() => {
                    bot.sendMessage(chatId, 'Menu', user_keyboard);
                }, octos.length * 1000);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    if(action === 'show_owned_octos') {
        axios.get(`http://localhost:3000/users/chatId/${chatId}`)
            .then((response) => {
                const user = response.data;

                const userId = user._id;

                setTimeout(() => {
                    axios.get(`http://localhost:3000/products/userId/${userId}`)
                        .then((response) => {
                            const octos = response.data;

                            octos.forEach((octo, index) => {
                                setTimeout(() => {
                                    const photo = Buffer.from(octo.photo, 'base64');

                                    const id = octo._id;

                                    bot.sendPhoto(chatId, photo,
                                        { caption: `${octo.name}, ${octo.price}` })
                                        .then((sentMessage) => {
                                            msgs[`${chatId}:${id}`] = sentMessage.message_id;
                                        });
                                }, index * 1000);
                            });

                            setTimeout(() => {
                                bot.sendMessage(chatId, 'Menu', user_keyboard);
                            }, octos.length * 1000);
                        });
                }, 2000);
            })
            .catch((error) => {
               console.log(error.message);
            });
    }

    if(action.startsWith('remove_octo')) {
        const str = action.replace('remove_octo', '');

        const [chatId, octoId] = str.split(':');

        const msgId = msgs[str];

        axios.delete(`http://localhost:3000/products/${octoId}`)
            .then(() => {
                console.log(`successfully deleted octo id ${octoId} from db`);
            })
            .catch(() => {
                console.log(`error deleting octo id ${octoId} from db`);
            });

        bot.deleteMessage(chatId, msgId);

        delete msgs[str];
    }

    if(action.startsWith('buy_octo')) {
        const str = action.replace('buy_octo', '');

        const [chatId, octoId] = str.split(':');

        axios.get(`http://localhost:3000/users/chatId/${chatId}`)
            .then((response) => {
                const user = response.data;

                const userId = user._id;

                const userProduct = {
                    user_id: userId,
                    product_id: octoId
                };

                setTimeout(() => {
                    axios.post('http://localhost:3000/userProducts/', userProduct)
                        .then((response) => {
                            bot.sendMessage(chatId, 'Successfully bought octo!');
                            console.log(response.data);
                        })
                        .catch((error) => console.log('wtf' + error.message));
                }, 1000);
            })
            .catch((error) => {
                bot.sendMessage(chatId, 'An error occurred while trying to buy octo.');
                console.log(error.message);
            });

        setTimeout(() => {
            bot.sendMessage(chatId, 'Menu', user_keyboard);
        }, octos.length * 1000);
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
        let photo = msg.photo[0];

        msg.photo.forEach((p) => {
            if(p.file_size < 200000) {
                photo = p;
            }
        });

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
                bot.sendMessage(chatId, 'Your octo was successfully created!');
                console.log(response.data);
            })
            .catch((error) => {
                bot.sendMessage(chatId, 'An error occurred while trying to create your octo.')
                console.log(error.message);
            });

        setTimeout(() => {
            bot.sendMessage(chatId, 'Admin menu', admin_keyboard);

            delete userStates[chatId];
        }, 2000);
    }
});