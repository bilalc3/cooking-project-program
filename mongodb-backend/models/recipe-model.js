const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    source: String,
    title: String,
    image_url: String,
    preview_image_url: String,
    description: String,
    ingredients_list: [{ 
        heading: String, 
        ingredients: [String] 
    }],
    method: [String],
    time: {
        preparation: String,
        cooking: String
    },
    serving_size: String,
    price_per_serving: mongoose.Number,
    total_price: mongoose.Number,
});

recipeSchema.index({title: 'text'});


const Recipe = mongoose.model('recipes', recipeSchema);

module.exports = Recipe;