const router = require('express').Router();
let Recipe = require('../models/recipe-model');


router.route('/').get((req, res) => {
    title = req.body.title;
    
    Recipe.find({'title': title})
    .then(recipes => res.json(recipes))
    .catch(err => res.status(400).json('Error ' + err));
});


router.route('/search').get((req, res) => {
    title = req.body.title;
    limit = req.body.limit || null;
    
    Recipe.find({$text: {$search: title}})
    .select(['title', 'source', 'description', 'preview_image_url'])
    .sort( { score: { $meta: "textScore" } } )
    .limit(limit)
    .then(recipes => res.json(recipes))
    .catch(err => res.status(400).json('Error ' + err));
});


router.route('/price').get((req, res) => {
    minPrice = req.body.minPrice || 0;
    maxPrice = req.body.maxPrice || 100000000;
    limit = req.body.limit || null;
    

    Recipe.find({ total_price: { $lte: maxPrice, $gte: minPrice } })
        .select(['title', 'total_price', 'source', 'description', 'preview_image_url'])
        .limit(limit)
        .then(recipes => res.json(recipes))
        .catch(err => res.status(400).json('Error message: ' + err));
});


module.exports = router;