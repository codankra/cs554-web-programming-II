import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import MachinesList from "./MachinesList";
import Machines from "./Machines";
import P404 from "./P404";

class MachinesContainer extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/machines/page/:page" exact component={MachinesList} />
          <Route path="/machines/:id" exact component={Machines} />
          <Route path="/" component={P404} />
        </Switch>
      </div>
    );
  }
}

export default MachinesContainer;
