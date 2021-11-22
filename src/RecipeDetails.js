import { Checkbox } from "@material-ui/core";
import { useParams } from "react-router-dom";
import useFetch from "./useFetch";


const RecipeDetails = () => {
    const { id } = useParams();
    const { data: recipes, error, isPending } = useFetch('http://localhost:3000/recipes/' + id);
    //const ingredients = { ingredients };
    //for (const element of ingredients) { 
    //    console.log(element);
    //}

    const ingredients = ["Cheese", "Tomatoes"];
 
    return ( 
        
    
        <div className="recipe-details">
            {ingredients.forEach(element => 
            {return (
                <div className="ingredients">
                
                { element }</div>
            )})}
             { isPending && <div>Loading...</div> }
            { error && <div>{ error }</div> }
            { recipes && 
            (
                <article>
                    { recipes.image_url }
                  <h2>{ recipes.title }</h2>
                  <div>{ recipes.description }</div>
                  <br/>
                  <h2>Ingredients Needed for { recipes.title } </h2>
            
                  
                  {recipes.ingredients_list.map(element => 
                     {return (
                     <div className="ingredients"> 
                     
                { element.heading }
                <br />

                
                { element.ingredients.map (element =>
                {return (
                    <div className="inglist">
                        <Checkbox />
                        {element}
                         </div>
                )})}
                </div>
                )})}
                <br />
                <h2>Cooking Instructions </h2>
                { recipes.method.map (element =>
                {return (
                    <div className="method">
                        {element} </div>
                )})}
                    <br />
                    <div>Serving Size: { recipes.serving_size } </div>

                    <div>Preparation Time: { recipes.time.preparation } </div>
                    <div>Cook Time: { recipes.time.cooking } </div>
                </article>
              )}
            
        </div>
     )
     
}
 
export default RecipeDetails;