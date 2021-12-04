import { useState  } from "react";
import './assets/css/choose.css'; 
import pumpkin_img from "./assets/images/pumpkinpie.png"; 
import macncheese_img from "./assets/images/macncheese.png"; 
import pizza_img from "./assets/images/pizza.png"; 

const recipelst = [ 
    {title: "Double Layer Pumpkin Cheesecake", 
    description : 'A great alternative to pumpkin pie, especially for those cheesecake fans out there. Serve topped with whipped cream', 
    body: 'lorem', 
    image: pumpkin_img, id:1}, 
    {title: "Homemade Mac and Cheese", 
    description: 'This is a nice rich mac and cheese. Serve with a salad for a great meatless dinner', 
    body: 'lorem',
    image: macncheese_img, id:2},
    {title: "Pizza", 
    description: 'Tastes like newspaper pizza, try it for yourself!', 
    body: 'lorem',
    image: pizza_img, id:3}   
];            

const Choose = () => {
    const [recipes, setRecipes] = useState(recipelst)
    return (  
        <div className="choose">
            <h1 className="title">Choose a recipe from the following list!</h1>
            {recipes.map((recipe) => (   
                <div className="recipe-preview" key={recipe.id}> 
         
                    <a href="/choose" className="recipe-title">{recipe.title}</a> 

                    <p className="recipe- description">{recipe.description}</p>    

                    <img src={recipe.image} alt="" />           
                </div>
             ))}
            
          
        </div>
   )
}
 
export default Choose;