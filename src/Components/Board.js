import { useGlobalState } from "../App";
import {useState, useEffect} from "react";
import toast, { Toaster } from 'react-hot-toast';

//TODO: timer with how long it took to solve memory game.

const Board = () => {
  const [card1, setCard1] = useGlobalState('card1');
  const [card2, setCard2] = useGlobalState('card2');
  const [types, setTypes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [cardsCompleted, setCardsCompleted] = useState(false);
  const [points, setPoints] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [card1Update, setCard1Update] = useState(false);
  const [card2Update, setCard2Update] = useState(false);
  const [win, setWin] = useGlobalState('win');


  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "a", "b", "c", "d", "e", "f", "g", "h"];
  const times = [1,2,3,4];
  let id = -1;

  function randomNumber(min, max) { 
    return Math.floor(Math.random() * (max - min) + min);
  } 

  const assignTypes = (lettersLocal) => {
    let tempLetters = lettersLocal;
    let tempTypes = types;
    for(var b = 0; b < 16; b++){
      if(tempTypes[b] === undefined){
        let id = randomNumber(0, tempLetters.length);
        const obj = {"id": b, "type": tempLetters[id]};
        tempTypes.push(obj);
        const index = tempLetters.indexOf(tempLetters[id]);
        tempLetters.splice(index, 1);
      }
    }

    setTypes(tempTypes);
  }

  useEffect(() => {
    let interval = false;
    if(timerActive){
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    }else if(!timerActive && seconds !== 0){
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, seconds]);

  useEffect(() => {
    assignTypes(letters);
    setLoaded(true);
  }, [])

  useEffect(() => {
    console.log(types);
  }, [types])

  useEffect(() => {
    if(card1Update){
      setCompleted([...completed, card1.id]);
      setCard1Update(false);
      setCard2Update(true);
      const obj2 = {"type": null, "id": null};
      setCard1(obj2);
    }
  }, [card1Update])

  useEffect(() => {
    if(card2Update){
      setCompleted([...completed, card2.id]);
      setCard2Update(false);
      const obj2 = {"type": null, "id": null};
      setCard2(obj2);
    }
  }, [card2Update])

  function secondsToTime(e){
    const h = Math.floor(e / 3600).toString().padStart(2,'0'),
          m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
          s = Math.floor(e % 60).toString().padStart(2,'0');
    
    return h + ':' + m + ':' + s;
}

  useEffect(() => {
    if(cardsCompleted){
      if(card2.type !== null){
        if(card1.type === card2.type){
          setPoints((prev) => prev + 1);
          if(points == (letters.length / 2) - 1){
            toast('You win! Your time: ' + secondsToTime(seconds), {
              icon: '👏',
            });
            setTimerActive(false);
            setWin(true);
          }else{
            setCard1Update(true);
          }
        }else{
          setTimeout(() => {
            document.getElementById(card1.id).classList.remove("flip");
            document.getElementById(card2.id).classList.remove("flip");
          }, 700);

          const obj2 = {"type": null, "id": null};
          setCard1(obj2);
          setCard2(obj2);
        }

        setCardsCompleted(false);
      }
    }
  },[cardsCompleted])

  const handleClick = async (e) => {
    if(card1.type === null || card2.type === null){
      var parent = e.target.classList.contains("front") || e.target.classList.contains("back") ? e.target.parentNode : e.target.parentNode.parentNode;
      const id = parent.id;
      if(!completed.includes(id)){
        var Div = document.getElementById(id);
        if(Div.classList.contains("flip"))
          Div.classList.remove("flip");
        else
          Div.classList.add("flip");
  
        
        const obj = {"type": types[id].type, "id": id};
        if(card1.type === null){
          setCard1(obj);
        }else if(card2.type === null){
          setCard2(obj);
          setCardsCompleted(true);
        }
      }
    }
  }

  return (
    <div className="game-wrapper">
      <div className="game-board">
        {times.map(line => {
          return(<ul key={line}>
          {times.map(card => {
            id++;
            return(<li key={id}>
              <div className="flip-inner" id={id} onClick={handleClick}>
                <div className="front">
                  <h1>?</h1>
                </div>
                <div className="back">
                  <img src={loaded ? "/icons/" +  types[id].type + ".png" : "/icons/unknown.png"}></img>
                </div>
              </div>
            </li>);
          })}
          </ul>);
        })}
      </div>
    </div>
  );
}
 
export default Board;