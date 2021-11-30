import { Schema, model } from 'mongoose';


const recipeSchema = new Schema({
    source: String,
    title: String,
    image_url: String,
    preview_image_url: String,
    description: String,
    ingredients_list: [{
        heading: String,
        ingredients: [ String ]
    }],
    method: [ String ],
    time: {
        preparation: String,
        cooking: String
    },
    serving_size: String,
    price_per_serving: Number,
    total_price: Number,
});


recipeSchema.index({title: 'text'});

export const Recipe = model('recipes', recipeSchema);