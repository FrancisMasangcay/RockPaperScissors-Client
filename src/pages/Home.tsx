import React, { Component } from "react";

//
import MyGrid from "../components/MyGrid";
import ActionButton from "../components/ActionButton";

interface props {}

interface state {
  roomCode?: number;
  joinRoomCode?: number;
}

const joinGrid = {
  gridTemplateColumns: "3fr 1fr",
  width: "15%",
  margin: "auto",
} as const;

class Home extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      roomCode: Math.floor(Math.random() * 999 + 1),
      joinRoomCode: undefined,
    };
  }

  joinAGame = () => {
    console.log("You Joined a game");
  };

  createAGame = () => {
    //search the current game lobbies and check if code is taken
    let codeIsAvailable = true;
    let temp = this.state.roomCode;
    while(!codeIsAvailable && temp){
      temp++;
      //check if code still unavailable
    }
    if(temp !== this.state.roomCode){
      this.setState({
        roomCode: temp,
      });
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Changing ${event.target.name} to ${event.target.value}`)
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    return (
      <>
        <div className="title">
          <h2>Join A Game</h2>
        </div>
        <MyGrid
          gridStyle={joinGrid}
          element1={
            <input
              className="code-input"
              onChange={this.handleChange}
              name="joinRoomCode"
              value={this.state.joinRoomCode}
              placeholder="Room #"
            ></input>
          }
          element2={
            <ActionButton onClickEvent={this.joinAGame} page={`/${this.state.joinRoomCode}`}>
              Join!
            </ActionButton>
          }
        ></MyGrid>
        <div className="title">
          <h2>Or</h2>
        </div>
        <div className="center-elements">
          <ActionButton onClickEvent={this.createAGame} page={`/${this.state.roomCode}`}>
            Create a Game
          </ActionButton>
        </div>
      </>
    );
  }
}

export default Home;
