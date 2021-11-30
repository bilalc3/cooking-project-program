import { useState, useEffect } from "react";
import fetch from 'node-fetch';
import './assets/css/choose.css';
import pumpkin_img from "./assets/images/pumpkinpie.png";
import macncheese_img from "./assets/images/macncheese.png";
import pizza_img from "./assets/images/pizza.png";
import useFetch from "./useFetch";



// http://localhost:8080/recipes/search?title=chicken

const Choose = () => {
    const searchterm = "ice cream";
    const recipelst = `http://localhost:8080/recipes/search?title=${searchterm}`;
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

                    <a href="/recipes/title" className="recipe-title">{recipe.title}</a>
                    <h6 className="price">${recipe.total_price}</h6>
                    <p id="better-text" className="recipe-description">{recipe.description}</p>
                    <img src={recipe.preview_image_url} alt="" />
                    
                </div>
            ))} 


        </div>
    )
}

export default Choose;