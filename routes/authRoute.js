import express from 'express';
import {
  loginController,
  registerController,
  testController,
} from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
// import { create } from '../DB/FCRUD.js';

//route object
const router = express.Router();

//routing
//Register || POST
router.post('/register', registerController);

//Login || POST
router.post('/login', loginController);
// router.post('/create', create);

//test route
router.get('/test', requireSignIn, isAdmin, testController);

export default router;
