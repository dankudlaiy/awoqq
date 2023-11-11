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
            [{ text: 'new octo', callback_data: 'add_octo_button' }],
            [{ text: 'octos', callback_data: 'show_admin_octos_button' }],
            [{ text: 'users', callback_data: 'show_users_button' }]
        ]
    }
};

const user_keyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'store', callback_data: 'show_octos_button' }],
            [{ text: 'inventory', callback_data: 'show_owned_octos' }],
            [{ text: 'balance', callback_data: 'show_balance' }]
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

    bot.getUserProfilePhotos(chatId, { limit: 1 })
        .then(async (photos) => {
            if(photos && photos.total_count > 0) {
                const photoObj = photos.photos[0];

                let photo = photoObj[0];

                photoObj.forEach((p) => {
                    if(p.file_size < 200000) {
                        photo = p;
                    }
                });

                const photoId = photo.file_id;

                const fileLink = await bot.getFileLink(photoId);

                const arrayBuffer = await (await fetch(fileLink)).arrayBuffer();

                const buffer = Buffer.from(arrayBuffer);

                bot.getChat(chatId)
                    .then((chatInfo) => {
                        const username = chatInfo.username;

                        if(username) {
                            const user = {
                                chat_id: chatId,
                                name: username,
                                balance: 0,
                                role: 'user',
                                photo: buffer
                            };

                            axios.post('http://localhost:3000/users/', user)
                                .then((response) => {
                                    console.log(response.data);
                                })
                                .catch((error) => {
                                    console.log(error.message);
                                });

                            bot.sendMessage(chatId, 'Welcome to octo-store!');

                            setTimeout(() => {
                                if(userRoles[chatId] === 'admin') {
                                    bot.sendMessage(chatId, 'admin menu', admin_keyboard);
                                    return;
                                }

                                bot.sendMessage(chatId, 'menu', user_keyboard);
                            }, 1000);
                        } else {
                            bot.sendMessage(chatId, 'error retrieving your username');
                        }
                    })
            } else {
                await bot.sendMessage(chatId, 'error retrieving your profile picture');
            }
        })
        .catch((error) => {
            console.log(error.message);
        });
});

bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const action = callbackQuery.data;

    if (action === 'add_octo_button') {
        bot.sendMessage(chatId, 'name for your new octo?');

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
                                    inline_keyboard: [[{ text: 'remove', callback_data: `remove_octo${chatId}:${id}`}]]
                                }
                            })
                            .then((sentMessage) => {
                                msgs[`${chatId}:${id}`] = sentMessage.message_id;
                            });
                    }, index * 1000);
                });

                setTimeout(() => {
                    bot.sendMessage(chatId, 'admin menu', admin_keyboard);
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
                                    inline_keyboard: [[{ text: 'buy?', callback_data: `buy_octo${chatId}:${id}` }]]
                                }
                            })
                            .then((sentMessage) => {
                                msgs[`${chatId}:${id}`] = sentMessage.message_id;
                            });
                    }, index * 1000);
                });

                setTimeout(() => {
                    bot.sendMessage(chatId, 'menu', user_keyboard);
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
                                bot.sendMessage(chatId, 'menu', user_keyboard);
                            }, octos.length * 1000);
                        });
                }, 2000);
            })
            .catch((error) => {
               console.log(error.message);
            });
    }

    if(action === 'show_balance') {
        axios.get(`http://localhost:3000/users/chatId/${chatId}`)
            .then((response) => {
                const user = response.data;

                bot.sendMessage(chatId, `your balance: ${user.balance}`);

                setTimeout(() => {
                    bot.sendMessage(chatId, 'menu', user_keyboard);
                    }, 1000);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    if(action === 'show_users_button') {
        axios.get('http://localhost:3000/users/')
            .then((response) => {
                const users = response.data;

                users.forEach((user, index) => {
                    setTimeout(() => {
                        const photo = Buffer.from(user.photo, 'base64');

                        const id = user._id;

                        bot.sendPhoto(chatId, photo,
                            {
                                caption: `${user.name}, ${user.balance}`,
                                reply_markup: {
                                    inline_keyboard: [[{ text: 'edit balance', callback_data: `edit_balance${chatId}:${id}` }]]
                                }
                            });
                    }, index * 1000);
                });

                setTimeout(() => {
                    bot.sendMessage(chatId, 'admin menu', admin_keyboard);
                }, users.length * 1000);
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

                setTimeout(() => {
                    axios.get(`http://localhost:3000/products/${octoId}`)
                        .then((response) => {
                            const octo = response.data;

                            if(user.balance < octo.price) {
                                bot.sendMessage(chatId, 'sorry but there is not enough money on your balance to buy this octo');
                                return;
                            }

                            const userId = user._id;

                            const userProduct = {
                                user_id: userId,
                                product_id: octoId
                            };

                            setTimeout(() => {
                                axios.post('http://localhost:3000/userProducts/', userProduct)
                                    .then((response) => {
                                        bot.sendMessage(chatId, 'successfully bought octo!');
                                        console.log(response.data);

                                        const newBalance = user.balance - octo.price;

                                        const userUpdateModel = {
                                            balance: newBalance
                                        }

                                        setTimeout(() => {
                                            axios.patch(`http://localhost:3000/users/${userId}`, userUpdateModel);
                                        }, 1000);
                                    })
                                    .catch((error) => console.log(error.message));
                            }, 1000);
                        })
                }, 1000);
            })
            .catch((error) => {
                bot.sendMessage(chatId, 'an error occurred while trying to buy octo.');
                console.log(error.message);
            });

        setTimeout(() => {
            bot.sendMessage(chatId, 'menu', user_keyboard);
        }, octos.length * 1000);
    }

    if(action.startsWith('edit_balance')) {
        const str = action.replace('edit_balance', '');

        const [chatId, userId] = str.split(':');

        userStates[chatId] = { state: `awaitingNewBalanceInput:${userId}`, inputs: {} };

        bot.sendMessage(chatId, 'new balance?');
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
        bot.sendMessage(chatId, `new octo name is: ${userInput}. And what is the price?`);

        userStates[chatId].state = 'awaitingNewOctoPriceInput';
    }

    if(currentState === 'awaitingNewOctoPriceInput') {
        if(isNaN(userInput)) {
            bot.sendMessage(chatId, 'please send correct number. Price?');
            return;
        }

        userStates[chatId].inputs[1] = userInput;
        userStates[chatId].state = 'awaitingNewOctoPhotoInput';

        bot.sendMessage(chatId, 'now upload photo of your new octo');
    }

    if(currentState.startsWith('awaitingNewBalanceInput')) {
        if(isNaN(userInput)) {
            bot.sendMessage(chatId, 'please send correct number. New balance?');
            return;
        }

        const userId = currentState.replace('awaitingNewBalanceInput:', '');

        const userUpdateModel = {
            balance: userInput
        }

        axios.patch(`http://localhost:3000/users/${userId}`, userUpdateModel)
            .then(() => {
                bot.sendMessage(chatId, 'user balance was successfully updated');
            })
            .catch((error) => {
                console.log(error.message);
                bot.sendMessage(chatId, 'error occurred updating user balance');
            });

        delete userStates[chatId];

        setTimeout(() => {
            bot.sendMessage(chatId, 'admin menu', admin_keyboard);
        }, 1000);
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
                bot.sendMessage(chatId, 'new octo was successfully created!');
                console.log(response.data);
            })
            .catch((error) => {
                bot.sendMessage(chatId, 'an error occurred while trying to create your octo.')
                console.log(error.message);
            });

        setTimeout(() => {
            bot.sendMessage(chatId, 'admin menu', admin_keyboard);

            delete userStates[chatId];
        }, 2000);
    }
});