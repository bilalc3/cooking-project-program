const router = require('express').Router();
let Recipe = require('../models/recipe-model');


router.route('/').get((req, res) => {
    title = req.query.title;
    
    if (!title)
        return res.status(400).json("Error: 'title' was not passed")

    Recipe.find({'title': title})
        .then(recipes => res.json(recipes))
        .catch(err => res.status(400).json('Error ' + err));
});


router.route('/search').get((req, res) => {
    title = req.query.title;
    limit = req.query.limit || null;
    
    if (limit)
        limit = parseInt(limit, 10)
    if (!title)
        return res.status(400).json("Error: 'title' was not passed")
    
    
    Recipe.find({$text: {$search: title}})
        .select(['title', 'total_price', 'source', 'description', 'preview_image_url'])
        .sort( { score: { $meta: "textScore" } } )
        .limit(limit)
        .then(recipes => res.json(recipes))
        .catch(err => res.status(400).json('Error ' + err));
});


router.route('/price').get((req, res) => {
    minPrice = req.query.minPrice || 0;
    maxPrice = req.query.maxPrice || 100000000;
    limit = req.query.limit || null;
    
    if (limit) limit = parseInt(limit, 10)
    if (minPrice) minPrice = parseFloat(minPrice)
    if (maxPrice) maxPrice = parseFloat(maxPrice)

    Recipe.find({ total_price: { $lte: maxPrice, $gte: minPrice } })
        .select(['title', 'total_price', 'source', 'description', 'preview_image_url'])
        .limit(limit)
        .then(recipes => res.json(recipes))
        .catch(err => res.status(400).json('Error message: ' + err));
});


module.exports = router;