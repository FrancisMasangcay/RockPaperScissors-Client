import React, { Component } from "react";
import { withRouter } from 'react-router';
import { io } from 'socket.io-client';
import { ENDPOINT } from '../util/config.js';
//components
import MyGrid from "../components/MyGrid";

interface props {
  match?: any;
}

interface state {
  pointsToWin?: number;
  player1?: string;
  player2?: string;
  roomCode?: number;
}
const entry = {
  gridTemplateColumns: "2fr 1fr",
  width: "20%",
  margin: "2vh auto 1vh auto",
} as const;

let socket; 

class GameLobby extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      pointsToWin: 3,
      player1: "",
      player2: "",
      roomCode: this.props.match.params.roomCode,
    };
  }

  componentDidMount(){
    socket = io(ENDPOINT);
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    return (
      <>
        <MyGrid
          gridStyle={entry}
          element1={<h3>Points to Win</h3>}
          element2={
            <input
              className="bordered-input"
              value={this.state.pointsToWin}
              name="pointsToWin"
              type="number"
              onChange={this.handleChange}
            ></input>
          }
        ></MyGrid>
        <MyGrid
          gridStyle={entry}
          element1={<h3>Room Code</h3>}
          element2={
            <input
              className="bordered-input"
              value={this.state.roomCode}
              name="roomCode"
              onChange={this.handleChange}
              readOnly
            ></input>
          }
        ></MyGrid>
        <MyGrid
          gridStyle={entry}
          element1={<h3>Player 1:</h3>}
          element2={
            <input
              className="bordered-input"
              value={this.state.player1}
              name="player1"
              onChange={this.handleChange}
            ></input>
          }
        ></MyGrid>
        <MyGrid
          gridStyle={entry}
          element1={<h3>Player 2:</h3>}
          element2={
            <input
              className="bordered-input"
              value={this.state.player2}
              name="player2"
              onChange={this.handleChange}
            ></input>
          }
        ></MyGrid>
      </>
    );
  }
}

export default withRouter(GameLobby as any);
