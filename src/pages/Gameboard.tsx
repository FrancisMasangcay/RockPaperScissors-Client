import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

//utils
import { NONE, ROCK, PAPER, SCISSORS } from "../util/cardTypes";
import { CONFIRM } from "../util/gameControlTypes";
import socket from "../util/socket";

//import { ENDPOINT } from "../util/config.js";

interface Name {
  username: string;
}

interface RootState {
  user: Name;
}

interface User {
  roomCode: number;
  username: string;
  player: number;
  score: number;
}

interface GameState {
  p1?: string;
  p2?: string;
  p1_points: number;
  p2_points: number;
}
interface RoomState {
  users: string[];
  pointsToWin: number;
  gameState: GameState;
  roomCode: number;
}

export default function Gameboard(props: any) {
  const [lobbyCode, setLobby] = useState(props.match.params.roomCode);
  const [activeCard, setCard] = useState(NONE);
  const [score, setScore] = useState(0);
  const [confirmed, setConfirm] = useState(false);
  const username = useSelector((state: RootState) => state.user.username);
  let p: User = {
    roomCode: lobbyCode,
    username: username,
    player: -1,
    score: 0,
  };
  let o: User = {
    roomCode: lobbyCode,
    username: "default",
    player: -1,
    score: 0,
  };
  let gs: GameState = {
    p1: "p1",
    p2: "p2",
    p1_points: 0,
    p2_points: 0,
  };
  let room: RoomState = {
    roomCode: lobbyCode,
    users: [],
    pointsToWin: 0,
    gameState: gs,
  };
  const [player, setPlayer] = useState(p);
  const [opponent, setOpponent] = useState(o);
  const [gameState, setGameState] = useState(gs);
  const [roomState, setRoomState] = useState(room);

  //hook to initialize gamestate
  useEffect(() => {
    console.log("initializing game");
    console.log("lobbyCode = ", lobbyCode);

    if(lobbyCode && username){socket.emit(
      "initializeGame",
      lobbyCode,
      username,
      (room: RoomState, user: any, opponent: any) => {
        setRoomState(room);
        setGameState(room.gameState);
        let temp: User = {
          ...user,
          score: 0,
        };
        setPlayer(temp);
        temp = {
          ...opponent,
          score: 0,
        }
        setOpponent(temp);
      }
    );}
  }, [lobbyCode, username]);

  //hook to listen for gamestate changes
  useEffect(() => {
    socket.on("updateState", (roomState: RoomState) => {
      setRoomState(roomState);
      setGameState(roomState.gameState);
    });
  });

  //hook to update activated card and confirm status
  function onElementClick(newAction: string) {
    switch (newAction) {
      case ROCK:
        setCard(ROCK);
        break;
      case PAPER:
        setCard(PAPER);
        break;
      case SCISSORS:
        setCard(SCISSORS);
        break;
      case NONE:
        setCard(NONE);
        break;
      case CONFIRM:
        setConfirm(!confirmed);
        break;
      default:
        break;
    }
    if (newAction === CONFIRM) {
      //emit to backend that user has confirmed selection
      socket.emit("confirm", confirmed);
    } else {
      //action was a card selection
      socket.emit("selectCard", activeCard);
    }
  }

  return (
    <>
      <div className="board-container">
        <div className="gameboard"></div>
        <div className="player-info-wrapper">
          <div className="opponent">
            {opponent.username}
            <input readOnly type="text" value={opponent.score} />
          </div>
          <div className="player">
            <div className="player-info">
              {username}
              <input readOnly type="text" value={player.score}></input>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
