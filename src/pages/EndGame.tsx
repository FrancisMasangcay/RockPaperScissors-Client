import React, { useState, useEffect }from 'react'
import socket from "../util/socket";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SET_USER } from '../redux/types';

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
  gameWinner: number;
  roundWinner: number;
}
interface RoomState {
  users: string[];
  pointsToWin: number;
  gameState: GameState;
  roomCode: number;
}

export default function EndGame(props: any) {
  let gs: GameState = {
    p1_points: -1,
    p2_points: -1,
    gameWinner: -1,
    roundWinner: -1
  }
  const [gameState, setGameState] = useState(gs)
  let temp: User = {
    roomCode: props.match.params.roomCode,
    username: "default",
    score: 0,
    player: -1
  }
  const [winner, setWinner] = useState(temp)
  const [loser, setLoser] = useState(temp)
  const username = useSelector((state: RootState) => state.user.username);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.emit('initializeGame', props.match.params.roomCode,
    username,
    (room: RoomState, user: User, opponent: User) => {
      //setRoomState(room);
      setGameState(room.gameState);
      let playerNumber = user.player;
      let playerPoints;
      let oppPoints;
      //figure out whose points are whose
      if(user.player === 1){ //current player is player1
        playerPoints = room.gameState.p1_points;
        oppPoints = room.gameState.p2_points
      }
      else{ //current player is player2
        playerPoints = room.gameState.p2_points;
        oppPoints = room.gameState.p1_points
      }
      if(room.gameState.gameWinner === playerNumber){ //current player won
        setWinner({
          ...user,
          score: playerPoints,
        });
        setLoser({
          ...opponent,
          score: oppPoints
        });
      }
      else{ //current player lost
        setWinner({
          ...opponent,
          score: oppPoints
        });
        setLoser({
          ...user,
          score: playerPoints
        });
      }
    })

    socket.on("playAgainCalled", (room: number) => {
      props.history.push(`/${room}`)
    })
  },[username])

  function playAgain(room: number){
    socket.emit('playAgain', room);
  }
  function mainMenu(room: number){
    dispatch({type: SET_USER, payload: ""})
    socket.emit('removeFromRoom', room);
  }
  return (
    <div className="end-game-wrapper">
      <div className="winner-wrapper">
        <div className={(winner.username === username) ? "winner player" : "winner opponent"}>Winner: {winner.username}</div>
        <div className={(winner.username === username) ? "score player": "score opponent"}>{`${winner.score}`}</div>
      </div>
      <div className="loser-wrapper">
        <div className={(loser.username === username) ? "loser player" : "loser opponent"}>{loser.username}</div>
        <div className={(loser.username === username) ? "score player": "score opponent"}>{loser.score}</div>
      </div>
      <Link onClick={(e) => {playAgain(winner.roomCode)}}to={`/${winner.roomCode}`}>
        <div className="center-elements button">
          <Button variant="contained" size="large">Play Again</Button>
        </div>
      </Link>

      <Link onClick={() => {mainMenu(winner.roomCode)}} to="/">
      <div className="center-elements button">
        <Button variant="contained" size="large" >Main Menu</Button>
      </div>
      </Link>
    </div>
  )
}
