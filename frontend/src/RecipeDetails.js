import { Checkbox } from "@material-ui/core";
import { useParams } from "react-router-dom";
import useFetch from "./useFetch";
import RoomIcon from '@material-ui/icons/Room';

const RecipeDetails = () => {
    const { title } = useParams();
    const { data: recipes, error, isPending } = useFetch('http://localhost:8080/recipes?title=' + title);

    return (
        <div className="recipe-details" >

            {isPending && <div>Loading...</div>}
            {error && <div>{error}</div>}
            {recipes &&
                (
                    <article>
                        <img src={recipes[0].image_url} alt="" />
                        <div align="left"> <h2>{recipes[0].title}</h2></div>
                        <div id="description" align="left"> {recipes[0].description}</div>
                        <br />
                        <div align="left"> <h2>Ingredients Needed {recipes[0].title} </h2>

                            {recipes[0].ingredients_list.map(element => {
                                return (
                                    <div className="ingredients">
                                        {element.ingredients.map(element => {
                                            return (
                                                <div className="inglist">
                                                    <Checkbox />
                                                    {element}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                            <br />
                            <h2>Cooking Instructions </h2>
                            {recipes[0].method.map(element => {
                                return (
                                    <div className="method">
                                        <RoomIcon />
                                        {element} <br />
                                    </div>
                                )
                            }
                            )
                            }
                            <br />
                            <div>Serving Size: {recipes[0].serving_size} </div>
                            <div>Preparation Time: {recipes[0].time.preparation} </div>
                            <div>Cook Time: {recipes[0].time.cooking} </div>
                        </div>
                    </article>
                )}
        </div>
    )
}

export default RecipeDetails;