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
    <div className="App" style={{ backgroundImage: `url(${image})`, backgroundRepeat:"no-repeat", backgroundSize:"cover", height:'100vh'}}>

      <Navbar />
      <div className="content">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path = "/choose/:title/:minprice/:maxprice" >
            <Choose />
          </Route>
          <Route path="/recipes/:title">
            <RecipeDetails />
          </Route>
        </Switch>
      </div>
    </div>
    </Router>
  );
}

export default App; 