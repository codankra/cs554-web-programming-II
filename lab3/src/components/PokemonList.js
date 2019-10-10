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
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.match.params.page !== prevProps.match.params.page) {
      this.setState({
        page: Number(this.props.match.params.page)
      });
      this.getPoke(this.props.match.params.page);
    }
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
    console.log(page);
    try {
      const offset = page*20;
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}`);
      if (offset>=0 && offset<response.data.count){
        this.setState({ data: response.data });
      }
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    let body = null;
    let li = null;
    let pCount = null;
    let buttons = null;
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
      if (this.state.page>0 && this.state.page<pCount) {
        buttons = 
        <div>
          <button onClick={this.getPrev}>Previous</button>
          <button onClick={this.getNext}>Next</button>
        </div>
      } else if(this.state.page>0){
        buttons = 
        <div>
          <button onClick={this.getPrev}>Previous</button>
        </div>
      } else {
        buttons = 
        <div>
          <button onClick={this.getNext}>Next</button>
        </div>
      }
      body = (
        <div>
          <ul className="list-unstyled">{li}</ul>
          {buttons}
        </div>
      );
    } else { //404
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

export default PokemonList;
