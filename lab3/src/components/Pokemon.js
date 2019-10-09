import React, { Component } from "react";
import axios from "axios";
import noImage from "../img/download.jpeg";

class Pokemon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      loading: false,
      error: false
    };
  }
  componentWillMount() {
    this.getPoke();
  }
  async getPoke() {
    this.setState({
      loading: true
    });
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${this.props.match.params.id}`
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
          <h1>Pokemon</h1>
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
      let img = null;
      if (this.state.data.sprites.front_default) {
        img = <img alt="Show" src={this.state.data.sprites.front_default} />;
      } else {
        img = <img alt="Show" src={noImage} />;
      }
      body = (
        <div>
          <h3 className="cap-first-letter">
            {this.state.data && this.state.data.name}
          </h3>
          {img}
          <br />
          <br />
          <p>
            Base Experience: {this.state.data.base_experience}
            <br />
            Height: {this.state.data.height}
            <br />
            Order: {this.state.data.order}
            <br />
            Weight: {this.state.data.weight}
            <br />
          </p>
          <b>Types</b>:
          <ul className="list-unstyled">
            {this.state.data && this.state.data.types.map(type => {
              return <li key={type.slot}>{type.type.name}</li>;
            })}
          </ul>
          <b>Base Stats</b>:
          <ul className="list-unstyled">
            {this.state.data && this.state.data.stats.map(stat => {
              return <li key={stat.stat.name}>{stat.stat.name}: {stat.base_stat}</li>;
            })}
          </ul>
          <b>Abilities</b>:
          <ul className="list-unstyled">
            {this.state.data.abilities.map(ability => {
              return <li key={ability.slot}>{ability.ability.name}</li>;
            })}
          </ul>
          <b>Moves</b>:
          <ul className="list-unstyled">
            {this.state.data && this.state.data.moves.map(move => {
              return <li key={move.move.name}>{move.move.name}</li>;
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

export default Pokemon;
