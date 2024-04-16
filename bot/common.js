const TelegramBot = require("node-telegram-bot-api");

require('dotenv').config();

require('./../api/initDb')();

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

module.exports = bot;