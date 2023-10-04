import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import {} from './DB/firebase.js';
import { db } from './DB/firestore.js';
// import { create } from './DB/FCRUD.js';
import authRoutes from './routes/authRoute.js';
//configure env
dotenv.config();

//rest object
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
app.use('/api/v1/auth', authRoutes);

//rest api
app.get('/', (req, res) => {
  try {
    res.send('<h1>Welcome to E-commerce</h1>');
  } catch (error) {
    console.log(error);
  }
});

//PORT
const PORT = process.env.PORT || 8080;

//Listens
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`.cyan);
});
