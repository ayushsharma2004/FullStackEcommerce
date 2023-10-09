import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import {
  SingleCategoryController,
  categoryController,
  createCategoryController,
  deleteCategoryController,
  updateCategoryController,
} from '../controllers/categoryController.js';

//route object
const router = express.Router();

//routes

//create category
router.post(
  '/create-category',
  requireSignIn,
  isAdmin,
  createCategoryController
);

//update category
router.put(
  '/update-category/:id',
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//get all category
router.get('/get-category', categoryController);

//get single category
router.get('/single-category/:slug', SingleCategoryController);

//delete category
router.delete(
  '/delete-category/:id',
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

export default router;
