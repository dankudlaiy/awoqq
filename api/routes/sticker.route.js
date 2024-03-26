const express = require('express');
const productController = require('../controllers/sticker.controller');

const router = express.Router();

//create a new sticker
router.post('/', productController.createSticker);

//get a list of all stickers
router.get('/', productController.getAllStickers);

//get a list of stickers by sticker set id
router.get('/stickerSetId/:id', productController.getStickersByStickerSetId);

//get a single sticker
router.get('/:id', productController.getStickerById);

//update a sticker
router.patch('/:id', productController.updateStickerById);

//delete a sticker
router.delete('/:id', productController.deleteStickerById);

module.exports = router;