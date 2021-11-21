import Navbar from './Navbar';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RecipeDetails from './RecipeDetails';
import image from './back.jpeg';

function App() {
  return (
    <Router>
    <div className="App" style={{ backgroundImage: `url(${image})`, backgroundRepeat:"no-repeat", backgroundSize:"contain", 
    height:1000,width:1600 }}>

      <Navbar />
      <div className="content">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/recipes/:id">
            <RecipeDetails />
          </Route>
        </Switch>
      </div>
    </div>
    </Router>
  );
}

export default App; 
