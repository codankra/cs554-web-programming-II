import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import BerriesList from "./BerriesList";
import Berries from "./Berries";

class BerriesContainer extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/berries/page/:page" exact component={BerriesList} />
          <Route path="/berries/:id" exact component={Berries} />
        </Switch>
      </div>
    );
  }
}

export default BerriesContainer;
