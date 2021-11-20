import logo from './logo.svg';
import './App.css';
import Choose from './Choose';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom' 
import { Link } from "react-router-dom";
import './assets/css/choose.css'; 


function App() {
  return (
    <Router>
    <div className="App">        
        {/* <nav>
        <Link to="/choose" style={{color: "black"}}>Choose Recipe!</Link>
        </nav> */}
        <Switch>
          <Route exact path = "/choose" >
            <Choose />
          </Route>
        </Switch>
  
    </div>
    </Router>
  );
}

export default App;