import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

//utils
import { NONE, ROCK, PAPER, SCISSORS } from "../util/cardTypes";
import socket from "../util/socket";

//components
import Card from "../components/Card";

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
  gameWinner: number;
  roundWinner: number;
}
interface RoomState {
  users: string[];
  pointsToWin: number;
  gameState: GameState;
  roomCode: number;
}

export default function Gameboard(props: any) {
  const [lobbyCode] = useState(props.match.params.roomCode);
  const [activeCard, setCard] = useState(NONE);
  const [opponentCard, setOpponentCard] = useState(NONE);
  const [roundComplete, setRound] = useState(false);
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
    roundWinner: -1,
    gameWinner: -1,
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

    if (lobbyCode && username) {
      socket.emit(
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
          };
          setOpponent(temp);
        }
      );
    }
  }, [lobbyCode, username]);

  useEffect(() => {
    console.log(opponent);
  }, [opponent]);
  //hook to listen for gamestate changes
  useEffect(() => {
    socket.on("updateState", (roomState: RoomState) => {
      //determine if a new round happened
      let currentPts = player.score + opponent.score;
      let serverPts =
        roomState.gameState.p1_points + roomState.gameState.p2_points;
      setRoomState(roomState);
      setGameState(roomState.gameState);
      if (currentPts !== serverPts) {
        setRound(true);
      }
    });
  }, []);

  useEffect(() => {
    if (roundComplete) {
      //update game state from round results
      if (player.player === 1) {
        setOpponentCard(gameState.p2 as any);
        setOpponent({
          ...opponent,
          score: gameState.p2_points,
        });
        setPlayer({
          ...player,
          score: gameState.p1_points,
        });
      } else {
        setOpponentCard(gameState.p1 as any);
        setOpponent({
          ...opponent,
          score: gameState.p1_points,
        });
        setPlayer({
          ...player,
          score: gameState.p2_points,
        });
      }

      //change UI to reflect the results of the round
      let playerRef = document.getElementsByClassName("player action-cards")[0];
      let oppRef = document.getElementsByClassName("opponent action-cards")[0];

      playerRef.classList.remove("player");
      playerRef.classList.add("inactive");

      oppRef.classList.remove("opponent");
      oppRef.classList.add("inactive");

      setTimeout(() => {
        if (
          gameState.p1_points === roomState.pointsToWin ||
          gameState.p2_points === roomState.pointsToWin
        ) {
          props.history.push(`/${lobbyCode}/end-game`);
        } else {
          setCard(NONE);
          setRound(false);
          playerRef.classList.add("player");
          playerRef.classList.remove("inactive");

          oppRef.classList.add("opponent");
          oppRef.classList.remove("inactive");
        }
      }, 3000);
    }
  }, [roundComplete]);

  //hook for button click
  useEffect(() => {
    //action was a card selection
    socket.emit("selectCard", lobbyCode, username, activeCard);
  }, [activeCard]);

  //hook to update activated card and confirm status
  function onElementClick(newAction: string) {
    if (!roundComplete) {
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
        default:
          break;
      }
    }
  }

  return (
    <>
      <div className="board-container">
        <div className="gameboard">
          <div className="action-cards opponent">
            <Card cardType={NONE}></Card>
            <Card cardType={NONE}></Card>
            <Card cardType={NONE}></Card>
          </div>
          <div className="active-element-wrapper">
            <Card cardType={opponentCard}></Card>
          </div>
          <div className="active-element-wrapper">
            <Card
              cardType={activeCard}
              onclick={() => console.log("The active card is ", activeCard)}
            ></Card>
          </div>
          <div className="action-cards player">
            <Card cardType={ROCK} onclick={() => onElementClick(ROCK)}></Card>
            <Card cardType={PAPER} onclick={() => onElementClick(PAPER)}></Card>
            <Card
              cardType={SCISSORS}
              onclick={() => onElementClick(SCISSORS)}
            ></Card>
          </div>
        </div>

        <div className="player-info-wrapper">
          <div className="player-info opponent">
            {opponent.username}: {opponent.score}
          </div>

          <div
            className="player-info player"
            onClick={() => console.log("Element clicked")}
          >
            {username}: {player.score}
          </div>
        </div>
      </div>
    </>
  );
}
