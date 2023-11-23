const createError = require("http-errors");
const mongoose = require("mongoose");

const UserProduct = require('../models/userProduct.model');

module.exports = {
    createUserProduct: async (req, res, next) => {

        try {
            const userProduct = new UserProduct(req.body);
            const result = await userProduct.save();

            res.send(result);
        } catch (error) {
            console.log(error.message);

            if(error.name === 'ValidationError') {
                next(createError(422, error.message));
                return;
            }

            next(error);
        }
    },

    getAllUserProducts: async (req, res) => {

        try{
            const results = await UserProduct.find({},{__v: 0})

            res.send(results);
        } catch (error) {
            console.log(error.message);
        }
    },

    getUserProductById: async (req, res, next) => {
        const id= req.params.id;

        try{
            const userProduct = await UserProduct.findById(id);

            if(!userProduct) {
                throw createError(404, "UserProduct does not exist.");
            }

            res.send(userProduct);
        } catch (error) {
            console.log(error.message);

            if(error instanceof mongoose.CastError) {
                next(createError(400, "Invalid userProduct id."));
                return;
            }

            next(error);
        }
    },

    updateUserProductById: async (req, res, next) => {
        const id = req.params.id;

        try{
            const options = { new: true };
            const result = await UserProduct.findByIdAndUpdate(id, req.body, options);

            if(!result) {
                throw createError(404, "UserProduct does not exist.");
            }

            res.send(result);
        } catch (error) {
            console.log(error.message);

            if(error instanceof mongoose.CastError) {
                next(createError(400, "Invalid userProduct id."));
                return;
            }

            next(error);
        }
    },

    deleteUserProductById: async (req, res, next) => {
        const id = req.params.id;

        try{
            const result = await UserProduct.findByIdAndDelete(id);

            if(!result) {
                throw createError(404, "UserProduct does not exist.");
            }

            res.send(result);
        } catch (error) {
            console.log(error.message);

            if(error instanceof mongoose.CastError) {
                next(createError(400, "Invalid userProduct id."));
                return;
            }

            next(error);
        }
    }
}