import express from 'express';
import dotenv from 'dotenv';
//import fileUpload from 'express-fileupload'; // tem de estar antes da rota 
import UserRouter from './routers/UserRouter.js'
import movieRouter from './routers/movieRouter.js';
import cors from 'cors';
import mongoose from 'mongoose';
//import bcrypt from 'bcryptjs';
//const jwt = require('jsonwebtoken');



dotenv.config();

const PORT = process.env.PORT || 7878;

const app = express();
//app.use(fileUpload());

//app.use(express.static('static'));



app.use(cors({
   origin: '*'
}))

app.use(express.json());
app.use('/auth', UserRouter);
app.use('/api', movieRouter);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


const startApp = async () => {
  try {

    mongoose.set('strictQuery', true);
    await mongoose.connect(String(process.env.MONGO_URI));
    console.log("Succssefully connected to DB");
    
    const userSchema = new mongoose.Schema({
      username: String,
      email: String,
      password: String
    });

    app.listen(PORT, () => {

      if (process.env.NODE_ENV === 'prod') {
        console.log(`server is running in production mode on port ${PORT}`);
      } else {
        console.log(`server is running in development mode on port ${PORT}`);
      }
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('Error connecting to database', err.message);
    }
  }
};

startApp();
