import express from "express";
import {
    getProducts,
    getProductById,
    saveProduct,
    updateProduct,
    deleteProduct
} from '../controllers/ProductController.js'

const router = express.Router()

router.get('/products', getProducts)
router.post('/products', saveProduct)

router.get('/products/:id', getProductById)
router.patch('/products/:id', updateProduct)
router.delete('/products/:id', deleteProduct)

export default router
