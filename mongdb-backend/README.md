# API spec
## /
Returns full recipe data by title.  
**Method:** `GET`  
**Data Params:**  
   `title=[string]` *(required)*
## /search
Returns recipes w/ basic info matching given title.  
**Method:** `GET`  
**Data Params:**  
   `title=[string]` *(required)*  
   `limit=[integer]` *(optional)* - max number of recipe suggestions to return (default: return all recipes)
## /price
Returns recipes w/ basic info matching given price range.  
**Method:** `GET`  
**Data Params:**  
   `minPrice=[integer]` *(optional)* - minimum recipe price  
   `maxPrice=[integer]` *(optional)* - maximum recipe price  
   `limit=[integer]` *(optional)* - max number of recipes to return (default: return all recipes)
