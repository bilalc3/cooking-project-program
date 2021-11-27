import { Router } from 'express'
import { Recipe } from '../models/recipe-model'

export const router = Router();


router.route('/').get((req, res) => {
    let title = req.query.title;
    
    // TODO remove duplicate code
    if (title == null)
        return res.status(400).json("Error: 'title' was not passed")
    else if (typeof title !== 'string' && !(title instanceof String))   // if not a string 
        return res.status(400).json(`Error: 'title' should be a single string value, recieved ${typeof title}`)
    else
        title = title.toString()

    
    Recipe.find({'title': title})
        .then(recipes => res.json(recipes))
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/search').get((req, res) => {
    let title = req.query.title;
    let limit: number = Number(req.query.limit) || 0;
    
    if (title == null)
        return res.status(400).json("Error: 'title' was not passed")
    else if (typeof title !== 'string' && !(title instanceof String))   // if not a string 
        return res.status(400).json(`Error: 'title' should be a single string value, recieved ${typeof title}`)
    else
        title = title.toString()

    
    Recipe.find({$text: {$search: title}})
        .select(['title', 'total_price', 'source', 'description', 'preview_image_url'])
        .sort( { score: { $meta: "textScore" } } )
        .limit(limit)
        .then(recipes => res.json(recipes))
        .catch(err => res.status(400).json('Error ' + err));
});


router.route('/price').get((req, res) => {
    let minPrice: number = Number(req.query.minPrice) || 0;
    let maxPrice: number = Number(req.query.maxPrice) || 100000000;
    let limit: number = Number(req.query.limit) || null;

    
    Recipe.find({ total_price: { $lte: maxPrice, $gte: minPrice } })
        .select(['title', 'total_price', 'source', 'description', 'preview_image_url'])
        .limit(limit)
        .then(recipes => res.json(recipes))
        .catch(err => res.status(400).json('Error message: ' + err));
});