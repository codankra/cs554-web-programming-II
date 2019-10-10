import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import PokemonList from "./PokemonList";
import Pokemon from "./Pokemon";
import P404 from "./P404";

class PokemonContainer extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/pokemon/page/:page" exact component={PokemonList} />
          <Route path="/pokemon/:id" exact component={Pokemon} />
          <Route path="/" component={P404} />

        </Switch>
      </div>
    );
  }
}

export default PokemonContainer;
