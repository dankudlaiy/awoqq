const express = require('express');
const productController = require('../controllers/product.controller');

const router = express.Router();

//create a new product
router.post('/', productController.createProduct);

//get a list of all products
router.get('/', productController.getAllProducts);

//get a list of products owned by a user
router.get('/userId/:id', productController.getProductsByUserId);

//get a single product
router.get('/:id', productController.getProductById);

//update a product
router.patch('/:id', productController.updateProductById);

//delete a product
router.delete('/:id', productController.deleteProductById);

module.exports = router;