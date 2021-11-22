
import './App.css';
import Choose from './Choose';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom' 
import { Link } from "react-router-dom";
import './assets/css/choose.css'; 
import Navbar from './Navbar';
import Home from './Home';
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
          <Route exact path = "/choose" >
            <Choose />
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
