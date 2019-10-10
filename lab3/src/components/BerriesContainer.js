import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import BerriesList from "./BerriesList";
import Berries from "./Berries";
import P404 from "./P404";

class BerriesContainer extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/berries/page/:page" exact component={BerriesList} />
          <Route path="/berries/:id" exact component={Berries} />
          <Route path="/" component={P404} />
        </Switch>
      </div>
    );
  }
}

export default BerriesContainer;
