const createError = require("http-errors");
const mongoose = require("mongoose");

const User = require('../models/user.model');

module.exports = {
    createUser: async (req, res, next) => {

        try {
            const user = new User(req.body);
            const result = await user.save();

            res.send(result);
        } catch (error) {
            if(error.name === 'ValidationError') {
                next(createError(422, error.message));
                return;
            }

            if(error.name === 'MongoServerError') {
                return;
            }

            console.log(error.message);

            next(error);
        }
    },

    getAllUsers: async (req, res) => {

        try{
            const results = await User.find({},{__v: 0})

            res.send(results);
        } catch (error) {
            console.log(error.message);
        }
    },

    getUserById: async (req, res, next) => {
        const id= req.params.id;

        try{
            const user = await User.findById(id);

            if(!user) {
                throw createError(404, "User does not exist.");
            }

            res.send(user);
        } catch (error) {
            console.log(error.message);

            if(error instanceof mongoose.CastError) {
                next(createError(400, "Invalid user id."));
                return;
            }

            next(error);
        }
    },

    updateUserById: async (req, res, next) => {
        const id = req.params.id;

        try{
            const options = { new: true };
            const result = await User.findByIdAndUpdate(id, req.body, options);

            if(!result) {
                throw createError(404, "User does not exist.");
            }

            res.send(result);
        } catch (error) {
            console.log(error.message);

            if(error instanceof mongoose.CastError) {
                next(createError(400, "Invalid user id."));
                return;
            }

            next(error);
        }
    },

    deleteUserById: async (req, res, next) => {
        const id = req.params.id;

        try{
            const result = await User.findByIdAndDelete(id);

            if(!result) {
                throw createError(404, "User does not exist.");
            }

            res.send(result);
        } catch (error) {
            console.log(error.message);

            if(error instanceof mongoose.CastError) {
                next(createError(400, "Invalid user id."));
                return;
            }

            next(error);
        }
    }
}