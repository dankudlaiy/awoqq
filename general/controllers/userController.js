const userService = require('../services/userService');

exports.createUser = async (req, res) => {
    const userData = req.body;
    try {
        const user = await userService.createUser(userData);
        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await userService.getUserById(userId);
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const newData = req.body;
    try {
        const updatedUser = await userService.updateUser(userId, newData);
        if (!updatedUser) {
            res.status(404).send('User not found');
            return;
        }
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await userService.deleteUser(userId);
        if (!deletedUser) {
            res.status(404).send('User not found');
            return;
        }
        res.json(deletedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};