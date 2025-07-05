import express from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';   
dotenv.config();

// console.log("Env test CLOUD_API_KEY:", process.env.CLOUD_API_KEY);

mongoose.set('strictQuery', true); // Add this line

const app = express();


const allowedOrigins = [
  "http://localhost:3000",                  // local dev
  "https://proconnect-frontend1.vercel.app" // deployed frontend
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like curl, Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from origin ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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