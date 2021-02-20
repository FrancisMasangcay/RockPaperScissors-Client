import React, { Component } from "react";
import { withRouter } from "react-router";
import { io } from "socket.io-client";
// import { ENDPOINT } from "../util/config.js";

//redux
import {connect} from 'react-redux';

//components
import MyGrid from "../components/MyGrid";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

//utils
import socket from "../util/socket";

interface props {
  match?: any;
  username?: string;
  history?: any;
}

interface state {
  pointsToWin?: number;
  player1?: string;
  player2?: string;
  roomCode?: number;
  username?: string;
}

const entry = {
  gridTemplateColumns: "2fr 1fr",
  width: "20%",
  margin: "2vh auto 1vh auto",
} as const;

//let socket = io(ENDPOINT);

class GameLobby extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      pointsToWin: 3,
      player1: "",
      player2: "",
      roomCode: this.props.match.params.roomCode,
      username: this.props.username,
    };
  }

  componentDidMount() {
    this.setState({
      username: this.props.username
    })
    //socket = io(ENDPOINT);
    socket.emit(
      "lobby",
      { _name: this.state.username, _room: this.state.roomCode },
      (error: any) => console.log(error)
    ); //join the room

    socket.on("init", (users: object, points: number) => {
      console.log("Users = ", users)
      this.setState({
        pointsToWin: points,
      });

      Object.values(users).forEach((user: any) => {
        Object.values(user)
        if(user.player === 1){
          console.log("setting player 1 name to ", user.username)
          this.setState({
            player1: user.username,
          })
        }
        else{
          console.log("setting player 2 name to ", user.username)
          this.setState({
            player2: user.username,
          })
        }
      })
    });

    socket.on('updateState', (roomState: any) => {
      console.log(roomState.pointsToWin)
      this.setState({
        pointsToWin: roomState.pointsToWin
      })
    })

    socket.on('play', () => {
      this.props.history.push(`/${this.state.roomCode}/play`)
    })
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [event.target.name]: event.target.value,
    }, () => {
      socket.emit('changePoints', this.state.pointsToWin, this.state.roomCode)
    });
  };

  handleStart = () => {
    socket.emit('startGame', this.state.roomCode);
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
        <div className="center-elements">
          <Button 
            variant="contained"
            size="large"
            onClick={this.handleStart}
            // component={Link}
            // to={`/${this.state.roomCode}/play`}
          >Start</Button>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: any) => ({
  username: state.user.username
})
export default connect(mapStateToProps)(withRouter(GameLobby as any) as any);
