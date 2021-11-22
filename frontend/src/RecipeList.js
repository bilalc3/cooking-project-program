import { Link } from "react-router-dom";

const RecipeList = ({ recipes }) => {
    //    const recipes = props.recipes;
    //    const title = props.title;
    
        return ( 
            <div className="recipe-list">
                {recipes.map(recipes => (
                    <div className="recipe-preview" key={recipes.id}>
                        <Link to={`/recipes/${recipes.id}`}>
                        <h2>{ recipes.title }</h2>
                        <p>Description: { recipes.description } </p>
                        </Link>
                       
    
                    </div>
                ))}
            </div>
         );
    }
     
    export default RecipeList;
    