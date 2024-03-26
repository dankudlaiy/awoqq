const createError = require("http-errors");
const mongoose = require("mongoose");

const Sticker = require('../models/sticker.model');
const StickerSet = require('../models/stickerSet.model');

module.exports = {
    createSticker: async (req, res, next) => {

        try {
            const sticker = new Sticker(req.body);
            const result = await sticker.save();

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

    getAllStickers: async (req, res) => {
        try{
            const results = await Sticker.find({},{__v: 0})

            res.send(results);
        } catch (error) {
            console.log(error.message);
        }
    },

    getStickersByStickerSetId: async (req, res) => {
        const id= req.params.id;

        try{
            const results = await Sticker.find({ stickerSet_id: id },{__v: 0})

            res.send(results);
        } catch (error) {
            console.log(error.message);
        }
    },

    getStickerById: async (req, res, next) => {
        const id= req.params.id;

        try{
            const sticker = await Sticker.findById(id);

            res.send(sticker);
        } catch (error) {
            console.log(error.message);

            next(error);
        }
    },

    updateStickerById: async (req, res, next) => {
        const id = req.params.id;

        try{
            const options = { new: true };
            const result = await Sticker.findByIdAndUpdate(id, req.body, options);

            res.send(result);
        } catch (error) {
            console.log(error.message);

            next(error);
        }
    },

    deleteStickerById: async (req, res, next) => {
        const id = req.params.id;

        try{
            const result = await Sticker.findByIdAndDelete(id);

            res.send(result);
        } catch (error) {
            console.log(error.message);

            next(error);
        }
    }
}