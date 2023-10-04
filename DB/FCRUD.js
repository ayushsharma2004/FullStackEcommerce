import express from 'express';
import {} from './firebase.js';
import { db } from './firestore.js';
import dotenv from 'dotenv';

dotenv.config();

//rest object
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

export const create = async (req, res) => {
  try {
    // call_read();
    let idfs = req.body.name;
    const userJson = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      contact: req.body.contact,
    };
    const response = await db
      .collection(process.env.collectionName)
      .doc(idfs)
      .set(userJson);
    console.log('success');
    res.send('success');
  } catch (error) {
    res.send(error);
  }
};
