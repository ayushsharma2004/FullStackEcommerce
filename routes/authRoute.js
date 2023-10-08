import express from 'express';
import {
  loginController,
  registerController,
  testController,
  forgotPasswordController,
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

//Forgot Password
router.post('/forgot-password', forgotPasswordController);

//test route
router.get('/test', requireSignIn, isAdmin, testController);

//protected user routing auth
router.get('/user-auth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected admin routing auth
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
