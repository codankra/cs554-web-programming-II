import React, { Component } from "react";
import "./App.css";

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: this.props.date,
      timeZone: this.props.timeZone
    };
  }
  componentDidMount() {
    this.timerID = setInterval(1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h2>It is {this.state.date.toLocaleTimeString('en-us', {timeZone: this.state.timeZone})} in {this.state.timeZone}</h2>
      </div>
    );
  }
}

export default Clock;
