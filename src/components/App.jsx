import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import PopUp from "./PopUp"
import GameP from "./GameP"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolling, setRolling]  = React.useState(false)
    const [roll, setRoll] = React.useState(0);
    const [start, setStart] = React.useState(false);
    const[seconds, setSeconds] = React.useState(0);
    const[minutes, setMinutes] = React.useState(0);
    const[hours, setHours] = React.useState(0);
    const [bestTime, setBestTime ] = React.useState(null);
    

        React.useEffect(()=> {
            const storedBestTime= JSON.parse(localStorage.getItem('bestTime'));
            if(storedBestTime){
                setBestTime(storedBestTime);
            }
        }, [])
   

        
        React.useEffect(() => {
            const newBestTime = hours*3600 + minutes*60 + seconds;
            if(tenzies && (bestTime === null || newBestTime < bestTime )) {
                localStorage.setItem('bestTime', JSON.stringify(newBestTime));
                setBestTime(newBestTime);
              
             }
            }, [tenzies]);
    
    
React.useEffect(() => {
    if (seconds > 59) {
        setSeconds(0);
        setMinutes(minute => minute + 1);
    }
    if (minutes > 59) {
        setMinutes(0);
        setHours(hour => hour + 1);
    }
    if (hours > 23) {
        setSeconds(0);
        setMinutes(0);
        setHours(0);
    }
}, [seconds, minutes, hours]);

      React.useEffect(()=> {
        let timer = setInterval(()=> {
            if(!start){
                return;
            }
            if(tenzies){
                return;
            }
             setSeconds(second => second+1);
          
            }, [1000])

    return () => clearInterval(timer)
      }, [start, !tenzies])





    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true);
            console.log("You won!");
          
        }
      
    }, [dice])

      
    function generateNewDie() {
        return {
            value: Math.floor(Math.random() * 6) + 1,
            isHeld: false,
            id: nanoid()
        }
    }
    

    function allNewDice() {
        const newDice = []
        for(let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }


    function rollDice() {
        if(!tenzies) {

        setRoll( x=> x+1 );
        setRolling(true);
     
        setTimeout(() => {
        setRolling(false);
        }, 1000);


        setDice(oldDice =>
            oldDice.map(die =>
                die.isHeld
                    ? die
                    : generateNewDie()
            )
        );
    }

    else {
        setTenzies(false)
        setRoll(0)
        setDice(allNewDice())
        setHours(0)
        setMinutes(0)
        setSeconds(0)
        setStart(false)
        return;
    }
    }
    

    function holdDice(id) {
        setStart(true);
       
        if(tenzies){
            return;
        }
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
            rolling= {rolling}
        />
    ))


         const currTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          const currseconds = hours*3600 + minutes*60 + seconds;
    function currentTIme() {
        return currTime;
    }
   
    return (
        <main>
            { tenzies && <Confetti />}
  
         {!start  &&  <h1 className="title">Tenzies</h1> }
         {!start && <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p> }
   

         {start && <div className='start-menu'>
      
        <h1 className='timer'>Time: {currentTIme()}</h1>
        <h1 className='count-roll'>Count: {roll}</h1>
      </div>
      }

{!tenzies && bestTime !== null && <h1 className='best-time'>Best Time: {formatTime(bestTime)}</h1>}

         {tenzies ? <PopUp  currseconds={currseconds} /> : <GameP diceElements={diceElements}/>}

            <button 
                className="roll-dice"
               
                onClick={rollDice}
            
            >

                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )

}



function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}


