const express = require("express")
const router =  express.Router()
const multerMiddleware = require('../Middlewares/multerMiddleware')

const userController = require('../Controllers/userController')
const productControler = require("../Controllers/productController")

router.post('/api/register',userController.registerAPI)
router.post('/api/login',userController.loginAPI)

router.post('/api/addProduct',multerMiddleware.single('productImg'),productControler.addProductAPI)
router.get('/api/getProducts', productControler.getProductsAPI);
router.put('/api/edit/:id', multerMiddleware.single('productImg'), productControler.editProductsAPI);
router.get('/api/getAProducts/:id', productControler.getAProductAPI);
router.delete('/api/delete/:id', productControler.deleteProductAPI);

module.exports = router