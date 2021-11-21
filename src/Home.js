import RecipeList from './RecipeList';
import useFetch from "./useFetch";

const Home = () => {
  const { error, isPending, data: recipes } = useFetch('http://localhost:3000/recipes')

  return (
    <div className="home">
      { error && <div>{ error }</div> }
      { isPending && <div>Loading...</div> }
      { recipes && <RecipeList recipes={recipes} /> }
    </div>
  );
}
 
export default Home;
