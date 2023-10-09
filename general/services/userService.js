const userRepository = require('../repositories/userRepository');

exports.createUser = async (userData) => {
    return userRepository.createUser(userData);
};

exports.getAllUsers = async () => {
    return userRepository.getAllUsers();
};

exports.getUserById = async (userId) => {
    return userRepository.getUserById(userId);
};

exports.updateUser = async (userId, newData) => {
    return userRepository.updateUser(userId, newData);
};

exports.deleteUser = async (userId) => {
    return userRepository.deleteUser(userId);
};