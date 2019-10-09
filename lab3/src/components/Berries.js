import React, { Component } from "react";
import axios from "axios";

class Berries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      loading: false,
      error: false
    };
  }
  componentWillMount() {
    this.getBerry();
  }
  async getBerry() {
    this.setState({
      loading: true
    });
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/berry/${this.props.match.params.id}`
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
          <h1>Berries</h1>
          <br />
          Loading...
        </div>
      );
    } else if (this.state.error) {
      body = (
        <div>
          <p>404 PAGE (ALL CAPS SO IT IT OBVIOUS) GO BACK TO THE SITE USING ONE OF THE ABOVE LINKS</p>
        </div>
        );
    } else if (this.state.data !== undefined) {
      body = (
        <div>
          <h3 className="cap-first-letter">
            {this.state.data && this.state.data.name}
          </h3>
          <br />
          <p>
            Growth Time: {this.state.data.growth_time}
            <br />
            Max Harvest: {this.state.data.max_harvest}
            <br />
            Natural Gift Power: {this.state.data.natural_gift_power}
            <br />
            Size: {this.state.data.size}
            <br />
            Smoothness: {this.state.data.smoothness}
            <br />
            Soil Dryness: {this.state.data.soil_dryness}
            <br />
          </p>
          <b>Flavors</b>:
          <ul className="list-unstyled">
            {this.state.data && this.state.data.flavors.map(flavor => {
              return <li key={flavor.flavor.name}>{flavor.flavor.name}: {flavor.potency}</li>;
            })}
          </ul>
        </div>
      );
    } else{
      body = (
        <div>
          <p>404 PAGE (ALL CAPS SO IT IT OBVIOUS) GO BACK TO THE SITE USING ONE OF THE ABOVE LINKS</p>
        </div>
        );
    }
    return body;
  }
}

export default Berries;
