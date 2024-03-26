const express = require('express');
const stickerSetController = require('../controllers/stickerSet.controller');

const router = express.Router();

//create a new sticker set
router.post('/', stickerSetController.createStickerSet);

//get a list of all sticker sets
router.get('/', stickerSetController.getAllStickerSets);

//get a single sticker set
router.get('/:id', stickerSetController.getStickerSetById);

//update a sticker set
router.patch('/:id', stickerSetController.updateStickerSetById);

//delete a sticker set
router.delete('/:id', stickerSetController.deleteStickerSetById);

module.exports = router;