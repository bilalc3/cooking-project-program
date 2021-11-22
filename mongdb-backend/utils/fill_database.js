const fs = require('fs');
const mongoose = require('mongoose');
const { exit } = require('process');

const recipes_data = require('../recipes_w_price');
let Recipe = require('./models/recipe-model');


username = process.env.DB_USERNAME;
password = process.env.DB_PASSWORD;
const uri = `mongodb+srv://${username}:${password}@cluster0.ciaf1.mongodb.net/RecipeDB`;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Connection to MongoDB is up')
});

save_requests = [];

for(i in recipes_data){
    new_recipe = Recipe(recipes_data[i]);
    save_requests.push( new_recipe.save() );
}

Promise.all(save_requests)
    .then(() => {
        console.log("Finished");
        exit(1);
    })