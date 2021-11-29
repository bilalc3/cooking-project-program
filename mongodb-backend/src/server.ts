import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { recipesRouter } from './routes/recipes';

dotenv.config();

const app = express();
app.use(cors())

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI as string;


mongoose.connect(MONGODB_URI);

mongoose.connection.once('open', () => {
    console.log('Connection to MongoDB is up')
});


app.use('/recipes', recipesRouter);


app.listen(
    PORT,
    () => console.log(`http://localhost:${PORT}`)
);