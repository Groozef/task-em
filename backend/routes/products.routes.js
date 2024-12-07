const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/products.controller');

const productController = new ProductController();


// EndPoints:
router.post('/create-product', productController.createProduct.bind(productController));
router.post('/create-stock', productController.createStock.bind(productController));
router.put('/increase-stock', productController.increaseStock.bind(productController));
router.put('/decrease-stock', productController.decreaseStock.bind(productController));
router.get('/get-stock-by-filter', productController.getStockByFilter.bind(productController)); 
router.get('/get-products-by-filter', productController.getProductsByFilter.bind(productController));

module.exports = router;