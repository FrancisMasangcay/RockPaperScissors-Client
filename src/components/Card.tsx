import React from 'react'
import question from '../assets/question.png'
import paper from '../assets/paper.png'
import scissors from '../assets/scissors.png'
import rock from '../assets/stones.png'
import {ROCK, PAPER, SCISSORS} from '../util/cardTypes';

interface props{
  cardType: string;
  onclick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>,) => void;
}

export default function Card(props: props){
  let card = props.cardType;
  console.log("in card ", card)
  if(card === ROCK && props.onclick){
    console.log("The card is ", card)
    return (
      <div className="card" onClick={props.onclick}>
        <div className="card-image" style={{backgroundImage:`url(${rock})`}}></div>
      </div>
    );
  }
  else if(card === PAPER && props.onclick){
    return (
      <div className="card" onClick={props.onclick}>
        <div className="card-image" style={{backgroundImage:`url(${paper})`}}></div>
      </div>
    );
  }
  else if(card === SCISSORS && props.onclick){
    return (
      <div className="card" onClick={props.onclick}>
        <div className="card-image" style={{backgroundImage:`url(${scissors})`}}></div>
      </div>
    );
  }
  else
    return (
      <div className="card">
        <div className="card-image" style={{backgroundImage:`url(${question})`}}></div>
      </div>
    );
}
