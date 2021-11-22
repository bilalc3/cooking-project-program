const express = require('express');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());


username = process.env.DB_USERNAME;
password = process.env.DB_PASSWORD;
const uri = `mongodb+srv://${username}:${password}@cluster0.ciaf1.mongodb.net/RecipeDB`;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Connection to MongoDB is up')
});


const recipeRouter = require('./routes/recipes');
app.use('/recipes', recipeRouter);


app.listen(
    PORT,
    () => console.log(`http://localhost:${PORT}`)
);