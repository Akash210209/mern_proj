import express from 'express';
import Products from '../models/products.js';
import mongoose from 'mongoose';
import multer from 'multer';
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    updateProduct,
    uploadProductImage
  } from '../controller/product.controller.js';
const router = express.Router();


router.post("/", multer().single('image'), uploadProductImage);
router.get("/", getAllProducts)
router.post("/", createProduct)
router.delete("/:id", deleteProduct)
router.put("/:id", updateProduct)

export default router