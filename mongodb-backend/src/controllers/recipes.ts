import { RequestHandler } from 'express';
import { Recipe } from '../models/recipe-model';


export const getRecipe: RequestHandler = (req, res) => {
    let title = req.query.title;
    
    // TODO remove duplicate code
    if (title == null)
        return res.status(400).json("Error: 'title' was not passed");
    else if (typeof title !== 'string' && !(title instanceof String))   // if not a string 
        return res.status(400).json(`Error: 'title' should be a single string value, recieved ${typeof title}`);
    else
        title = title.toString();

    
    Recipe.find({'title': title})
        .then(recipes => res.json(recipes))
        .catch(err => res.status(400).json('Error ' + err));
};



export const searchRecipe: RequestHandler = (req, res) => {
    let title = req.query.title;
    let minPrice: number = Number(req.query.minPrice) || 0;
    let maxPrice: number = Number(req.query.maxPrice) || 100000000;
    let limit: number = Number(req.query.limit) || 100;
    let skip: number = Number(req.query.skip) || 0;
    
    if (title == null)
        return res.status(400).json("Error: 'title' was not passed");
    else if (typeof title !== 'string' && !(title instanceof String))   // if not a string 
        return res.status(400).json(`Error: 'title' should be a single string value, recieved ${typeof title}`);
    else
        title = title.toString();

    const pipeline = [
        {
            $search: {
                "index": "autocompleteIndex",
                "autocomplete": {
                  "query": title,
                  "path": "title",
                //   "fuzzy": {}
                }
                // "highlight": {
                //   "path": "title"
                // }
            }
        },

        {
            $match: {
                'total_price': {
                    $gte: minPrice, 
                    $lte: maxPrice
                }
            }
        },

        { $skip: skip },
        { $limit: limit },
        
        {
            $project: {
                'title': 1, 
                'total_price': 1, 
                'source': 1, 
                'description': 1, 
                'preview_image_url': 1,
                "score": { "$meta": "searchScore" },
                // "highlights": { "$meta": "searchHighlights" },
            }
        }
    ];

    Recipe.aggregate(pipeline)
        .then(recipes => res.json(recipes))
        .catch(err => res.status(400).json(`Error '${err}'`));
};



export const getRecipesInPriceRange: RequestHandler = (req, res) => {
    let minPrice: number = Number(req.query.minPrice) || 0;
    let maxPrice: number = Number(req.query.maxPrice) || 100000000;
    let limit: number = Number(req.query.limit) || 100;
    let skip: number = Number(req.query.skip) || 0;

    
    Recipe.find({ total_price: { $lte: maxPrice, $gte: minPrice } })
        .select(['title', 'total_price', 'source', 'description', 'preview_image_url'])
        .skip(skip)
        .limit(limit)
        .then(recipes => res.json(recipes))
        .catch(err => res.status(400).json('Error message: ' + err));
};