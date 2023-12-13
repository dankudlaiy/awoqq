process.env.NTBA_FIX_319 = '1';
process.env.NTBA_FIX_350 = '0';

const port = process.env.PORT;

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const sharp = require('sharp')

require('dotenv').config();

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const api_uri = process.env.API_URI;

console.log('bot is running');

const userStates = {};

const userRoles = {};

const msgs = new Map();

const admin_keyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'new plushie', callback_data: 'add_product_button' }],
            [{ text: 'plushies', callback_data: 'show_admin_products_button' }],
            [{ text: 'users', callback_data: 'show_users_button' }]
        ]
    }
};

const user_keyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'store', callback_data: 'show_products_button' }],
            [{ text: 'sticker set', callback_data: 'show_sticker_set' }],
            [{ text: 'balance', callback_data: 'show_balance' }]
        ]
    }
};

try {
    axios.get(`${api_uri}/users/`)
        .then((initUsersResponse) => {
            const users = initUsersResponse.data;

            users.forEach((user) => {
                userRoles[user.chat_id] = user.role;
            });
        });
} catch(error) {
    console.log(error.message);
}

bot.onText(/\/start/, async (msg) => {
    try{
        const chatId = msg.chat.id;

        const usersResponse = await axios.get(`${api_uri}/users/`);

        const users = usersResponse.data;

        for(const user of users) {
            if(user.chat_id === chatId.toString()) {
                if(userRoles[chatId] === 'admin') {
                    await bot.sendMessage(chatId, 'admin menu', admin_keyboard);
                    return;
                }

                await bot.sendMessage(chatId, 'menu', user_keyboard);
                return;
            }
        }

        const photos = await bot.getUserProfilePhotos(chatId, { limit: 1 });

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

            const chatInfo = await bot.getChat(chatId);

            const username = chatInfo.username;

            if(username) {
                const user = {
                    chat_id: chatId,
                    name: username,
                    balance: 0,
                    role: 'user',
                    photo: buffer
                };

                await axios.post(`${api_uri}/users/`, user);

                await bot.sendMessage(chatId, 'Welcome to plushies-store!');

                await bot.sendMessage(chatId, 'menu', user_keyboard);
            } else {
                await bot.sendMessage(chatId, 'error retrieving your username');
            }
        } else {
            await bot.sendMessage(chatId, 'error retrieving your profile picture');
        }
    } catch (error) {
        console.log(error.message);
    }
});

bot.on('callback_query', async (callbackQuery) => {
    try{
        const chatId = callbackQuery.message.chat.id;
        const action = callbackQuery.data;

        if (action === 'add_product_button') {
            await bot.sendMessage(chatId, 'name for your new plushie?');

            userStates[chatId] = { state: 'awaitingNewProductNameInput', inputs: {} };
        }

        if (action === 'show_admin_products_button') {
            let response = await axios.get(`${api_uri}/products/`);

            const products = response.data;

            for (const product of products) {
                const photo = Buffer.from(product.photo, 'base64');

                const id = product._id;

                const sentMessage = await bot.sendPhoto(chatId, photo,
                    {
                        caption: `${product.name}, ${product.price}`,
                        reply_markup: {
                            inline_keyboard: [[{ text: 'remove', callback_data: `remove_product${chatId}:${id}`}]]
                        }
                    });

                msgs[`${chatId}:${id}`] = sentMessage.message_id;
            }

            await bot.sendMessage(chatId, 'admin menu', admin_keyboard);
        }

        if (action === 'show_products_button') {
            let response = await axios.get(`${api_uri}/products/`);

            const products = response.data;

            for (const product of products) {
                const photo = Buffer.from(product.photo, 'base64');

                const id = product._id;

                await bot.sendPhoto(chatId, photo,
                    {
                        caption: `${product.name}, ${product.price}`,
                        reply_markup: {
                            inline_keyboard: [[{ text: 'buy?', callback_data: `buy_product${chatId}:${id}` }]]
                        }
                    });
            }

            await bot.sendMessage(chatId, 'menu', user_keyboard);
        }

        if (action === 'show_sticker_set') {
            let response = await axios.get(`${api_uri}/users/chatId/${chatId}`);

            const user = response.data;

            const userId = user._id;

            response = await axios.get(`${api_uri}/products/userId/${userId}`);

            const products = response.data;

            if(products.length < 1) {
                await bot.sendMessage(chatId, 'You dont have any plushies for now. Try to buy some at the store!');

                await bot.sendMessage(chatId, 'menu', user_keyboard);

                return;
            }

            const stickerSet = await bot.getStickerSet(`${user.name}_tts_by_plshs_bot`);

            const randomIndex = Math.floor(Math.random() * stickerSet.stickers.length);
            const randomSticker = stickerSet.stickers[randomIndex];

            await bot.sendSticker(chatId, randomSticker.file_id);

            await bot.sendMessage(chatId, 'menu', user_keyboard);
        }

        if (action === 'show_balance') {
            const response = await axios.get(`${api_uri}/users/chatId/${chatId}`);

            const user = response.data;

            await bot.sendMessage(chatId, `your balance: ${user.balance}`);

            await bot.sendMessage(chatId, 'menu', user_keyboard);
        }

        if (action === 'show_users_button') {
            const response = await axios.get(`${api_uri}/users/`)

            const users = response.data;

            for (const user of users) {
                const photo = Buffer.from(user.photo, 'base64');

                const id = user._id;

                await bot.sendPhoto(chatId, photo,
                    {
                        caption: `${user.name}, ${user.balance}`,
                        reply_markup: {
                            inline_keyboard: [[{ text: 'edit balance', callback_data: `edit_balance${chatId}:${id}` }]]
                        }
                    });
            }

            await bot.sendMessage(chatId, 'admin menu', admin_keyboard);
        }

        if (action.startsWith('remove_product')) {
            const str = action.replace('remove_product', '');

            const [chatId, productId] = str.split(':');

            const msgId = msgs[str];

            await axios.delete(`${api_uri}/products/${productId}`);

            await bot.deleteMessage(chatId, msgId);

            delete msgs[str];
        }

        if (action.startsWith('buy_product')) {
            const str = action.replace('buy_product', '');

            const [chatId, productId] = str.split(':');

            let response = await axios.get(`${api_uri}/users/chatId/${chatId}`)

            const user = response.data;

            response = await axios.get(`${api_uri}/products/${productId}`);

            const product = response.data;

            if(user.balance < product.price) {
                await bot.sendMessage(chatId, 'sorry but there is not enough money on your balance to buy this plushie');
                return;
            }

            const userId = user._id;

            const userProduct = {
                user_id: userId,
                product_id: productId
            };

            await axios.post(`${api_uri}/userProducts/`, userProduct);

            const newBalance = user.balance - product.price;

            const userUpdateModel = {
                balance: newBalance
            }

            await axios.patch(`${api_uri}/users/${userId}`, userUpdateModel);

            let stickerSet = null;

            try {
                stickerSet = await bot.getStickerSet(`${user.name}_tts_by_plshs_bot`);
            } catch(e) {
                console.log(`trying to create sticker set for a user: ${user.name}`);
            }

            const photo = Buffer.from(product.photo, 'base64');

            if(!stickerSet) {
                await bot.createNewStickerSet(chatId, `${user.name}_tts_by_plshs_bot`, `${user.name}_tts`, photo, '😎');
            } else {
                await bot.addStickerToSet(chatId, `${user.name}_tts_by_plshs_bot`, photo, '😎');
            }

            await bot.sendMessage(chatId, 'successfully bought plushie!');

            await bot.sendMessage(chatId, 'menu', user_keyboard);
        }

        if (action.startsWith('edit_balance')) {
            const str = action.replace('edit_balance', '');

            const [chatId, userId] = str.split(':');

            userStates[chatId] = { state: `awaitingNewBalanceInput:${userId}`, inputs: {} };

            await bot.sendMessage(chatId, 'new balance?');
        }
    } catch (error) {
        console.log(error.message);
    }
});

bot.on('message', async (msg) => {
    try{
        const chatId = msg.chat.id;
        const userInput = msg.text;

        if(userStates[chatId]) {
            let currentState = userStates[chatId].state || 'default';

            if (currentState === 'awaitingNewProductNameInput') {
                userStates[chatId].inputs[0] = userInput;
                await bot.sendMessage(chatId, `new plushie name is: ${userInput}. And what is the price?`);

                userStates[chatId].state = 'awaitingNewProductPriceInput';
            }

            if (currentState === 'awaitingNewProductPriceInput') {
                if (isNaN(userInput)) {
                    await bot.sendMessage(chatId, 'please send correct number. Price?');
                    return;
                }

                userStates[chatId].inputs[1] = userInput;
                userStates[chatId].state = 'awaitingNewProductPhotoInput';

                await bot.sendMessage(chatId, 'now upload photo of your new plushie');
            }

            if (currentState.startsWith('awaitingNewBalanceInput')) {
                if (isNaN(userInput)) {
                    await bot.sendMessage(chatId, 'please send correct number. New balance?');
                    return;
                }

                const userId = currentState.replace('awaitingNewBalanceInput:', '');

                const userUpdateModel = {
                    balance: userInput
                }

                await axios.patch(`${api_uri}/users/${userId}`, userUpdateModel);

                await bot.sendMessage(chatId, 'user balance was successfully updated');

                delete userStates[chatId];

                await bot.sendMessage(chatId, 'admin menu', admin_keyboard);
            }
        }
    } catch (error) {
        console.log(error.message);
    }
});

bot.on('photo', async(msg) => {
    const chatId = msg.chat.id;

    let currentState = 'default';

    try{
        currentState = userStates[chatId].state;

        if(currentState === 'awaitingNewProductPhotoInput') {
        let photo = msg.photo[0];

        msg.photo.forEach((p) => {
            if(p.file_size < 200000) {
                photo = p;
            }
        });

        const photoFileId = photo.file_id;

        const fileLink = await bot.getFileLink(photoFileId);

        const arrayBuffer = await (await fetch(fileLink)).arrayBuffer();

        const originalBuffer = Buffer.from(arrayBuffer);

        const buffer = await resizeImage(originalBuffer);

        const product = {
            name: userStates[chatId].inputs[0],
            price: userStates[chatId].inputs[1],
            photo: buffer
        };

        await axios.post(`${api_uri}/products/`, product);

        await bot.sendMessage(chatId, 'new plushie was successfully created!');

        await bot.sendMessage(chatId, 'admin menu', admin_keyboard);
    }
    } catch (error) {
        console.log(error.message);
    }
});

async function resizeImage(arrayBuffer) {
    return  await sharp(arrayBuffer)
        .resize(512, 512, {
            fit: 'inside'
        })
        .toBuffer();
}