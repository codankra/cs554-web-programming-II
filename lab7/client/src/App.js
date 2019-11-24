import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './components/Home'
import { BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import P404 from "./components/P404";
import BinList from "./components/BinList";
import PostList from "./components/PostList";
// import NewPost from "./components/NewPost";

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
            <Link className="App-link" to="/my-posts"
            onClick={() => {window.location.assign("/my-posts");}}>
              Posted List
            </Link>
            <p></p>
            <Link className="App-link" to="/my-bin" 
            onClick={() => {window.location.assign("/my-bin");}}>
              Binned List
            </Link>
          </div>
      </header>
      <Switch>
            <Route path="/my-bin" component={BinList} />
            <Route path="/my-posts" component={PostList} />
            <Route path="/new-post" component={P404} />
            <Route path="/" exact component={Home} />
            <Route path="/*" component={P404} />
      </Switch>
    </div>
    </Router>
  );
}

export default App;
