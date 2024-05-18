import JWT from 'jsonwebtoken';
import { db } from '../DB/firestore.js';

export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization; // Get the token from the request headers
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token is required. Please login again.',
      });
    }

    const decode = JWT.verify(token, process.env.JWT_token);
    req.user = decode;
    console.log(decode);
    next();
  } catch (error) {
    console.log(error);
  }
};

//admin access
export const isAdmin = async (req, res, next) => {
  try {
    const userRef = db.collection(process.env.collectionName).doc(req.user._id);
    const response = await userRef.get();
    const user = response.data();
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: 'Unauthorized Access',
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: 'Error in Admin Access',
      error: error,
    });
  }
};
