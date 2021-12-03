import { useState, useEffect } from "react";
import fetch from 'node-fetch';
import './assets/css/choose.css';
import pumpkin_img from "./assets/images/pumpkinpie.png";
import macncheese_img from "./assets/images/macncheese.png";
import pizza_img from "./assets/images/pizza.png";
import useFetch from "./useFetch";
import { Link, useParams, useLocation, useHistory} from "react-router-dom";



// http://localhost:8080/recipes/search?title=chicken

const Choose = ( props ) => {

    const { title } = useParams();
    const { minprice } = useParams();
    const { maxprice } = useParams();


    const searchterm = "chicken";
    const recipelst = `http://localhost:8080/recipes/search?title=${title}&minPrice=${minprice}&maxPrice=${maxprice}`;
    const [recipes, setRecipes] = useState(null)

    useEffect ( () => {
        fetch(recipelst)
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log(data);
                setRecipes(data);
            });

    }, []);


    return (
        <div className="choose">

            <h1 className="title">Choose a recipe from the following list!</h1>

            {recipes && recipes.map((recipe) => (
                <div className="recipe-preview" key={recipe._id}>
                    <Link to={`/recipes/${recipe.title}`}>
                        <h3 className="recipe-title">{recipe.title}</h3>
                    </Link>
                    <h6 className="price">${recipe.total_price}</h6>
                    <p id="better-text" className="recipe-description">{recipe.description}</p>
                     <Link to={`/recipes/${recipe.title}`}>
                        <img src={recipe.preview_image_url} alt="" />
                      </Link>
                       
   
                    
                </div>
            ))} 


        </div>
    )
}

export default Choose;