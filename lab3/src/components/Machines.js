import React, { Component } from "react";
import axios from "axios";

class Machines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      loading: false,
      error: false
    };
  }
  componentWillMount() {
    this.getMachine();
  }
  async getMachine() {
    this.setState({
      loading: true
    });
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/machine/${this.props.match.params.id}`
      );
      console.log(response);
      this.setState({
        data: response.data,
        loading: false
      });
    } catch (e) {
      console.log(`error ${e}`);
      this.setState({
        data: undefined,
        error: true,
        loading: false
      });

    }
  }
  render() {
    let body = null;
    //const regex = /(<([^>]+)>)/gi;
    if (this.state.loading) {
      body = (
        <div>
          <h1>Machines</h1>
          <br />
          Loading...
        </div>
      );
    } else if (this.state.error) {
      body = (
        <div>
          <h2>404</h2>
            <p>You have accessed an invalid link on the site. Use one of the above links to get back on track!</p>
        </div>
        );
    } else if (this.state.data !== undefined) {
      body = (
        <div>
          <h2 className="cap-first-letter">
            Machine ID #{this.state.data && this.state.data.id}
          </h2>
          <br />
          <p>
            Machine Name: {this.state.data.item.name}
            <br />
            Machine Move: {this.state.data.move.name}
            <br />
            Machine Version Group: {this.state.data.version_group.name}
            <br />
            </p>
        </div>
      );
    } else{
      body = (
        <div>
          <h2>404</h2>
        <p>You have accessed an invalid link on the site. Use one of the above links to get back on track!</p>
        </div>
        );
    }
    return body;
  }
}

export default Machines;
