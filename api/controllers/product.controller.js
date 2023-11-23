const createError = require("http-errors");
const mongoose = require("mongoose");

const Product = require('../models/product.model');
const UserProduct = require('../models/userProduct.model');

module.exports = {
    createProduct: async (req, res, next) => {

        try {
            const product = new Product(req.body);
            const result = await product.save();

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

    getAllProducts: async (req, res) => {

        try{
            const results = await Product.find({},{__v: 0})

            res.send(results);
        } catch (error) {
            console.log(error.message);
        }
    },

    getProductsByUserId: async (req, res) => {
        const userId = req.params.id;

        try{
            const userProducts = await UserProduct.find({user_id: userId}).exec();

            const products = [];

            for(const userProduct of userProducts) {

                const s = userProduct._doc.product_id.toString();
                const p = await Product.findById(s);

                products.push(p);
            }

            res.send(products);
        } catch (error) {
            console.log(error.message);
        }
    },

    getProductById: async (req, res, next) => {
        const id= req.params.id;

        try{
            const product = await Product.findById(id);

            if(!product) {
                throw createError(404, "Product does not exist.");
            }

            res.send(product);
        } catch (error) {
            console.log(error.message);

            if(error instanceof mongoose.CastError) {
                next(createError(400, "Invalid product id."));
                return;
            }

            next(error);
        }
    },

    updateProductById: async (req, res, next) => {
        const id = req.params.id;

        try{
            const options = { new: true };
            const result = await Product.findByIdAndUpdate(id, req.body, options);

            if(!result) {
                throw createError(404, "Product does not exist.");
            }

            res.send(result);
        } catch (error) {
            console.log(error.message);

            if(error instanceof mongoose.CastError) {
                next(createError(400, "Invalid product id."));
                return;
            }

            next(error);
        }
    },

    deleteProductById: async (req, res, next) => {
        const id = req.params.id;

        try{
            const result = await Product.findByIdAndDelete(id);

            if(!result) {
                throw createError(404, "Product does not exist.");
            }

            res.send(result);
        } catch (error) {
            console.log(error.message);

            if(error instanceof mongoose.CastError) {
                next(createError(400, "Invalid product id."));
                return;
            }

            next(error);
        }
    }
}