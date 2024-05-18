import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCountController,
  productFiltersController,
  productListController,
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
  '/update-product/:slug',
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
router.get('/product-photo/:slug', productPhotoController);

//delete category
router.delete(
  '/delete-product/:slug',
  // requireSignIn,
  // isAdmin,
  deleteProductController
);

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

export default router;
