const User = require('../models/user');

exports.createUser = async (userData) => {
    const user = new User(userData);
    return user.save();
};

exports.getAllUsers = async () => {
    return User.find();
};

exports.getUserById = async (userId) => {
    return User.findById(userId);
};

exports.updateUser = async (userId, newData) => {
    return User.findByIdAndUpdate(userId, newData, { new: true });
};

exports.deleteUser = async (userId) => {
    return User.findByIdAndDelete(userId);
};