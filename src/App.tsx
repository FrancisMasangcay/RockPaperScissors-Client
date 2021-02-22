import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from 'axios';

//redux
import { Provider } from "react-redux";
import store from './redux/store.js';

//components
import Home from "./pages/Home";
import GameLobby from "./pages/GameLobby";
import Gameboard from "./pages/Gameboard";
import EndGame from "./pages/EndGame";

axios.defaults.baseURL =
  "http://localhost:5000/";

function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/:roomCode" component={GameLobby}></Route>
            <Route exact path="/:roomCode/play" component={Gameboard}></Route>
            <Route exact path="/:roomCode/end-game" component={EndGame}></Route>
          </Switch>
        </Router>
      </Provider>
    </>
  );
}

export default App;
