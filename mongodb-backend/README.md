# Install
Install all node modules:
```console
cd mongodb-backend
npm install
```
Create `.env` file with `MONGODB_URI` used to connect to your MongoDB server.   
**To Start the server: `npm start`**
# API spec
## /
Returns full recipe data by title.  
**Method:** `GET`  
**Query Params:**  
   `title=[string]` *(required)*
## /search
Returns recipes w/ basic info matching given title.  
**Method:** `GET`  
**Query Params:**  
   `title=[string]` *(required)*  
   `limit=[integer]` *(optional)* - max number of recipes to return (default: return all recipes)
## /price
Returns recipes w/ basic info matching given price range.  
**Method:** `GET`  
**Query Params:**  
   `minPrice=[float]` *(optional)* - minimum recipe price (default: 0)  
   `maxPrice=[float]` *(optional)* - maximum recipe price (default: 100000000)  
   `limit=[integer]` *(optional)* - max number of recipes to return (default: return all recipes)

# Data format
### Basic recipe info example
```json
"_id": "619ad554bc9780bbc609497a",
"source": "https://www.bbc.co.uk/food/recipes/chickenwithsataysauc_70986",
"title": "Chicken satay",
"preview_image_url": "https://ichef.bbci.co.uk/food/ic/food_16x9_320/recipes/chickenwithsataysauc_70986_16x9.jpg",
"description": "Chicken satay is a party favourite. Thread the chicken pieces onto soaked bamboo skewers to cook on the barbecue. ",
"total_price": 9.5
```
### Full recipe info example
```json
"time": {
    "preparation": "less than 30 mins",
    "cooking": "10 to 30 mins"
},
"_id": "619ad554bc9780bbc609497a",
"source": "https://www.bbc.co.uk/food/recipes/chickenwithsataysauc_70986",
"title": "Chicken satay",
"image_url": "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/chickenwithsataysauc_70986_16x9.jpg",
"preview_image_url": "https://ichef.bbci.co.uk/food/ic/food_16x9_320/recipes/chickenwithsataysauc_70986_16x9.jpg",
"description": "Chicken satay is a party favourite. Thread the chicken pieces onto soaked bamboo skewers to cook on the barbecue. ",
"ingredients_list": [
    {
    "heading": null,
    "ingredients": [
        "450g/1lb boneless, skinless chicken breasts, cut into 2.5cm/1in cubes",
        "1½ tbsp groundnut (peanut) oil"
    ],
    "_id": "619ad554bc9780bbc609497b"
    },
    {
    "heading": "For the marinade",
    "ingredients": [
        "3 tbsp light soy sauce",
        "1 tbsp Shaoxing rice wine or dry sherry",
        "salt ",
        "freshly ground black pepper",
        "2 tsp cornflour"
    ],
    "_id": "619ad554bc9780bbc609497c"
    },
    {
    "heading": "For the sauce",
    "ingredients": [
        "3 tbsp sesame paste or smooth peanut butter",
        "1 tbsp chilli bean sauce (available from Asian grocers)",
        "1 tbsp coarsely chopped garlic",
        "2 tsp chilli oil",
        "2 tbsp Chinese white rice vinegar or cider vinegar",
        "2 tbsp light soy sauce",
        "salt ",
        "freshly ground pepper",
        "2 tsp sugar",
        "2 tbsp hot water"
    ],
    "_id": "619ad554bc9780bbc609497d"
    },
    {
    "heading": "To serve",
    "ingredients": [
        "50g/2oz thinly sliced onions",
        "100g/4oz thinly sliced cucumbers"
    ],
    "_id": "619ad554bc9780bbc609497e"
    }
],
"method": [
    "In a medium-sized bowl, combine the marinade ingredients, stirring to combine. Add the chicken, mix well and leave to marinate, covered, for at least 20 minutes at room temperature. Drain, discarding the marinade.",
    "For the sauce, put all the sauce ingredients in a blender or food processor and process until smooth.",
    "Heat a wok over high heat until it is very hot, then add the groundnut oil. When the oil is very hot and slightly smoking, add the chicken pieces and stir-fry for another five minutes until the chicken is browned.",
    "Turn the heat down to low, add the sauce and continue to stir-fry for another five minutes.",
    "Turn onto a warm platter, garnish with the onion and cucumber and serve at once."
],
"serving_size": "Serves 2-4",
"price_per_serving": 4.75,
"total_price": 9.5
```