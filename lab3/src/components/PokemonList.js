import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class PokemonList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      loading: false,
      page: Number(this.props.match.params.page),
    };
    this.getPrev = this.getPrev.bind(this, this.state.page);
    this.getNext = this.getNext.bind(this, this.state.page);
  }
  componentDidMount() {
    this.getPoke(this.props.match.params.page);
  }
  async getPrev() {
    let temp = this.state.page;
    this.setState({ page: temp - 1}, () => {
      this.getPoke(this.state.page);
      this.props.history.push(`/pokemon/page/${this.state.page}`);
    });
  }
  async getNext() {
    let temp = this.state.page;
    this.setState({ page: temp + 1 }, () => {
      this.getPoke(this.state.page);
      this.props.history.push(`/pokemon/page/${this.state.page}`);
    });
    
  }
  async getPoke(page) {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${page * 20}`);
      this.setState({ data: response.data });
    } catch (e) {
      console.log(e);
      //J-Boy: Stacks and Queues EB2 # 1 and 2 (get and release turn)
    }
  }
  render() {
    let body = null;
    let li = null;
    let pCount = null;
    if (this.state.data) {
      li =
        this.state.data &&
        this.state.data.results.map(pokemon => {

          return (
            <li key={pokemon.name}>
              <Link to={`/pokemon/${pokemon.name}`}>{pokemon.name}</Link>
            </li>
          );
        });
      pCount = this.state.data.count;
      pCount = pCount/20 -1;
    }
    body = (
      <div>
        <ul className="list-unstyled">{li}</ul>
        <button onClick={this.getPrev}>Previous</button>
        <button onClick={this.getNext}>Next</button>
        <p>Current Page: {pCount}</p>
      </div>
    );

    return body;
  }
}

export default PokemonList;
