import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//components
import Home from "./pages/Home";
import GameLobby from "./pages/GameLobby";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route exact path="/:roomCode" component={GameLobby}></Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
