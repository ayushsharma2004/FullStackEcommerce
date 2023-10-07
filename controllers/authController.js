import { db } from '../DB/firestore.js';
import { comparePassword, hashPassword } from '../helper/authHelper.js';
import JWT from 'jsonwebtoken';

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    if (!name) {
      return res.send({ message: 'Name is required' });
    }
    if (!email) {
      return res.send({ message: 'Email is required' });
    }
    if (!password) {
      return res.send({ message: 'Password is required' });
    }
    if (!phone) {
      return res.send({ message: 'Phone is required' });
    }
    if (!address) {
      return res.send({ message: 'Address is required' });
    }
    if (!answer) {
      return res.send({ message: 'Answer is required' });
    }

    //existing user
    const querySnapshot = await db
      .collection(process.env.collectionName)
      .where('email', '==', email)
      .get();
    if (!querySnapshot.empty) {
      return res.status(200).send({
        success: false,
        message: 'User already registered. Please login.',
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);

    const userJson = {
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
      address: address,
      answer: answer,
      role: 0,
    };
    const userId = email; // Use email as the document ID

    if (typeof hashedPassword !== 'string') {
      console.log(typeof hashedPassword);
      console.log(hashedPassword);
      return res.status(500).send({
        success: false,
        message: 'Error in registration: Invalid password',
      });
    }

    await db.collection(process.env.collectionName).doc(userId).set(userJson);
    console.log('success');

    return res.status(201).send({
      success: true,
      message: 'User registered successfully',
      user: userJson,
    });
  } catch (error) {
    console.error('Error in registration:', error);
    return res.status(500).send({
      success: false,
      message: 'Error in registration',
      error: error.message,
    });
  }
};

//Login User
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Validtion
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: 'Invalid email or password',
      });
    }
    //Retrieve user data
    const querySnapshot = await db
      .collection(process.env.collectionName)
      .where('email', '==', email)
      .get();
    let userData = null;
    querySnapshot.forEach((doc) => {
      userData = doc.data();
    });

    //validating user
    if (!userData) {
      return res.status(404).send({
        success: false,
        message: 'User is not registered',
      });
    }

    //comparing user password with hashed/encrypted password
    const match = await comparePassword(password, userData.password);
    //verifying password
    if (!match) {
      return res.status(200).send({
        success: false,
        message: 'Invalid Password',
      });
    }

    //token
    const token = await JWT.sign(
      { _id: userData.email },
      process.env.JWT_token,
      {
        expiresIn: '7d',
      }
    );
    res.status(200).send({
      success: true,
      message: 'Login successfully',
      user: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        role: userData.role,
      },
      token,
    });
    console.log('success');
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in login',
      error: error,
    });
  }
};

//forgotPasswordController
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    //validation
    if (!email) {
      res.status(400).send({ message: 'Email is required' });
    }
    if (!answer) {
      res.status(400).send({ message: 'Email is required' });
    }
    if (!newPassword) {
      res.status(400).send({ message: 'Email is required' });
    }

    //retrive user data
    const querySnapshot = await db
      .collection(process.env.collectionName)
      .where('email', '==', email)
      .where('answer', '==', answer)
      .get();

    let userData = null;
    querySnapshot.forEach((doc) => {
      userData = doc.data();
    });

    //validating user
    if (!userData) {
      return res.status(404).send({
        success: false,
        message: 'Wrong email or answer',
      });
    }

    //hashing password
    const hashed = await hashPassword(newPassword);

    //update password
    const docRef = db
      .collection(process.env.collectionName)
      .doc(userData.email);
    await docRef.update({ password: hashed });

    res.status(200).send({
      success: true,
      message: 'Password Updated Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Something went wrong',
      error: error,
    });
  }
};

export const testController = (req, res) => {
  res.send('Protected Routes');
};
