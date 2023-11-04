const express = require('express');
const userProductController = require('../controllers/userProduct.controller');

const router = express.Router();

//create a new user's product
router.post('/', userProductController.createUserProduct);

//get a list of all user's products
router.get('/', userProductController.getAllUserProducts);

//get a single user's product
router.get('/:id', userProductController.getUserProductById);

//update a user's product
router.patch('/:id', userProductController.updateUserProductById);

//delete a user's product
router.delete('/:id', userProductController.deleteUserProductById);

module.exports = router;