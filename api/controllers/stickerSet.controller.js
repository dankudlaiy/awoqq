const createError = require("http-errors");

const StickerSet = require('../models/stickerSet.model');
const Sticker = require('../models/sticker.model');

module.exports = {
    createStickerSet: async (req, res, next) => {

        try {
            const stickerSet = new StickerSet(req.body);
            const result = await stickerSet.save();

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

    getAllStickerSets: async (req, res) => {
        try{
            const results = await StickerSet.find({},{__v: 0})

            res.send(results);
        } catch (error) {
            console.log(error.message);
        }
    },

    getStickerSetById: async (req, res, next) => {
        const id= req.params.id;

        try{
            const stickerSet = await StickerSet.findById(id);

            if(!stickerSet) {
                throw createError(404, "StickerSet was not found.");
            }

            res.send(stickerSet);
        } catch (error) {
            console.log(error.message);

            next(error);
        }
    },

    updateStickerSetById: async (req, res, next) => {
        const id = req.params.id;

        try{
            const options = { new: true };
            const result = await StickerSet.findByIdAndUpdate(id, req.body, options);

            res.send(result);
        } catch (error) {
            console.log(error.message);

            next(error);
        }
    },

    deleteStickerSetById: async (req, res, next) => {
        const id = req.params.id;

        try{
            const result = await StickerSet.findByIdAndDelete(id);

            const childResult = await Sticker.deleteMany({ stickerSet_id: id } );

            console.log(childResult);

            res.send(result);
        } catch (error) {
            console.log(error.message);

            next(error);
        }
    }
}