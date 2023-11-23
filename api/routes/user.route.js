const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

//create a new user
router.post('/', userController.createUser);

//get a list of all users
router.get('/', userController.getAllUsers);

//get a single user
router.get('/:id', userController.getUserById);

//get a user by chat id
router.get('/chatId/:id', userController.getUserByChatId);

//update user
router.patch('/:id', userController.updateUserById);

//delete user
router.delete('/:id', userController.deleteUserById);

module.exports = router;