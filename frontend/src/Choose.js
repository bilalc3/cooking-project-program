import { useState, useEffect } from "react";
import fetch from 'node-fetch';
import './assets/css/choose.css';
import pumpkin_img from "./assets/images/pumpkinpie.png";
import macncheese_img from "./assets/images/macncheese.png";
import pizza_img from "./assets/images/pizza.png";
import useFetch from "./useFetch";



const recipelst = [
    {
        title: "Double Layer Pumpkin Cheesecake",
        description: 'A great alternative to pumpkin pie, especially for those cheesecake fans out there. Serve topped with whipped cream',
        body: 'lorem',
        image: pumpkin_img, id: 1
    },
    {
        title: "Homemade Mac and Cheese",
        description: 'This is a nice rich mac and cheese. Serve with a salad for a great meatless dinner',
        body: 'lorem',
        image: macncheese_img, id: 2
    },
    {
        title: "Pizza",
        description: 'Tastes like newspaper pizza, try it for yourself!',
        body: 'lorem',
        image: pizza_img, id: 3
    }
];
// http://localhost:8080/recipes/search?title=chicken

const Choose = () => {
    const searchterm = "chicken";
    const recipelst1 = `http://localhost:8080/recipes/search?title=${searchterm}`;
    const [recipes, setRecipes] = useState(null)

    useEffect ( () => {
        fetch("http://localhost:8080/recipes/search?title=chicken")
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
                    <p className="recipe-description">{recipe.description}</p>
                    <img src={recipe.preview_image_url} alt="" />
                    
                </div>
            ))} 


        </div>
    )
}

export default Choose;