import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './components/Home'
import { BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import P404 from "./components/P404";
import BinList from "./components/P404";
import PostsList from "./components/P404";
import NewPostForm from "./components/P404";

function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="Link-body">
            <Link className="App-link" to="/">
              Home
            </Link>
            <p></p>
            <Link className="App-link" to="/new-post">
              Make New Post
            </Link>
            <p></p>
            <Link className="App-link" to="/my-posts">
              Posted List
            </Link>
            <p></p>
            <Link className="App-link" to="/my-bin">
              Binned List
            </Link>
          </div>
      </header>
      <Switch>
            <Route path="/my-bin" component={BinList} />
            <Route path="/my-posts" component={PostsList} />
            <Route path="/new-post" component={NewPostForm} />
            <Route path="/" exact component={Home} />
            <Route path="/*" component={P404} />
      </Switch>
      <Home />
    </div>
    </Router>
  );
}

export default App;
