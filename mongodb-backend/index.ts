import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { router } from './routes/recipes'

dotenv.config();


const app = express();
const mongodb_uri = process.env.MONGODB_URI;
const PORT = process.env.PORT || 8080;


mongoose.connect(mongodb_uri);

mongoose.connection.once('open', () => {
    console.log('Connection to MongoDB is up')
});


app.use('/recipes', router);


app.listen(
    PORT,
    () => console.log(`http://localhost:${PORT}`)
);