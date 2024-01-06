import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  updateProductController,
} from '../controllers/productController.js';
import formidable from 'express-formidable';

//route object
const router = express.Router();

//routes

//create category
router.post(
  '/create-product',
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//update category
router.put(
  '/update-product/:pid',
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get all category
router.get('/get-product', getProductController);

//get single category
router.get('/single-product/:slug', getSingleProductController);

//get photo
router.get('/product-photo/:pid', productPhotoController);

//delete category
router.delete(
  '/delete-product/:pid',
  // requireSignIn,
  // isAdmin,
  deleteProductController
);

export default router;
