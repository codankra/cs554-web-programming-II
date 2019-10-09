import React, { Component } from "react";
import logo from "./img/logo.svg";
import "./App.css";
import PokemonContainer from "./components/PokemonContainer";
import BerriesContainer from "./components/BerriesContainer";
import MachinesContainer from "./components/MachinesContainer";

import { BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to the PokeAPI lab</h1>
            
          </header>
          <br />
          <br />
          <div className="App-body">
          <div className="Link-body">
            <p>Welcome to the PokeAPI lab Pallette Town introduction page!</p>
            <Link className="pokeLink" to="/pokemon/page/0">
              Pokemon Listings
            </Link>
            <p>Pokemon are "pocket monsters" that inhabit the world of pokemon.</p>
            <Link className="pokeLink" to="/berries/page/0">
              Berry Listings
            </Link>
            <p>Berries are small, juicy, fleshy fruit. As in the real world, a large variety exists in the Pokémon world, with a large range of flavors, names, and effects.</p>
            <Link className="pokeLink" to="/machines/page/0">
              Machine Listings
            </Link>
            <p>Machines (ex. TMs and HMs) are used to teach pokemon new moves.</p>
          </div>
          <hr></hr>
          <Switch>
            <Route path="/pokemon" component={PokemonContainer} />
            <Route path="/berries" component={BerriesContainer} />
            <Route path="/machines" component={MachinesContainer} />
          </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
