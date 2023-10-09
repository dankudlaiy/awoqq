const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/user', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/user:id', userController.getUserById);
router.put('/user:id', userController.updateUser);
router.delete('/user:id', userController.deleteUser);

module.exports = router;