import express from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';   
dotenv.config();

mongoose.set('strictQuery', true); // Add this line

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // your frontend URL
  credentials: true,
}));
app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);
app.use('/uploads', express.static('uploads')); //to access the uploads folder
//uplaods relative path not like c,d




const start = async () => {
     try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(9091, () => {
      console.log('Server running on port 9091');
    });
  } catch (err) {
    console.error('Failed to connect to DB', err);
  }
};

// app.listen(9090,()=>{
//     console.log('Server is running on port 9090 ');
// });



start();


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});