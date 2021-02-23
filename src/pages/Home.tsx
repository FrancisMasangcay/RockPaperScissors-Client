import React, { Component } from "react";
import axios from "axios";

//components
import MyGrid from "../components/MyGrid";
import ActionButton from "../components/ActionButton";

//redux
import {SET_USER} from "../redux/types"
import { connect } from "react-redux";

//assets
import logo from "../assets/favicon.png"

interface props {
  history: any;
  dispatch: any;
}

interface state {
  roomCode?: number;
  joinRoomCode?: number;
  username?: string
}

const buttonedGrid = {
  gridTemplateColumns: "3fr 1fr",
  width: "15%",
  margin: "auto",
} as const;

const userGrid = {
  gridTemplateColumns: "1fr",
  width: "15%",
  margin: "5vh auto 1vh auto"
} as const;

class Home extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      roomCode: undefined,
      joinRoomCode: undefined,
      username: ""
    };
  }

  componentDidMount(){
    this.props.dispatch({type: SET_USER, payload: ""})
  }

  joinAGame = () => {
    if(this.state.username)
    {
      let name = this.state.username.trim().toLowerCase();
      this.props.dispatch({type: SET_USER, payload: name});
      this.props.history.push(`/${this.state.joinRoomCode}`);
    }
};

  createAGame = () => {
    if(this.state.username !== ""){
      axios
        .post("/create-lobby")
        .then((res) => {
          this.setState({
            roomCode: res.data.roomCode,
          });
        })
        .then(() => {
          if(this.state.username)
          {
            let name = this.state.username.trim().toLowerCase();
            this.props.dispatch({type: SET_USER, payload: name});
          }
        })
        .then(() => {
          this.props.history.push(`/${this.state.roomCode}`);
        })
        .catch((err) => console.log(err));
    }
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Changing ${event.target.name} to ${event.target.value}`);
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    return (
      <>
        <div className="center-elements">
          <img src={logo}/>
        </div>
        <MyGrid
          gridStyle={userGrid}
          element1={
            <input
              className="code-input"
              onChange={this.handleChange}
              name="username"
              value={this.state.username}
              placeholder="Username"
            ></input>
          }
          element2={
            <>
            </>
          }
        ></MyGrid>
        <div className="title">
          <h2>Join A Game</h2>
        </div>
        <MyGrid
          gridStyle={buttonedGrid}
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
            <ActionButton
              onClickEvent={this.joinAGame}
              //page={`/${this.state.joinRoomCode}`}
            >
              Join!
            </ActionButton>
          }
        ></MyGrid>
        <div className="title">
          <h2>Or</h2>
        </div>
        <div className="center-elements create-game">
          <ActionButton
            onClickEvent={this.createAGame} 
          >
            Create a Game
          </ActionButton>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: any) => ({
  username: state.username,
});

export default connect(mapStateToProps)(Home);
