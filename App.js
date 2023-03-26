import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rollCount, setRollCount] = React.useState(0);
    const [bestTime, setBestTime] = React.useState(localStorage.getItem("bestTime") ? JSON.parse(localStorage.getItem("bestTime")) : 1000);
    const [startTime, setStartTime] = React.useState(Date.now());
    const [currentTime, setCurrentTime] = React.useState(0);
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setCurrentTime( prevCurrentTime => {
                let newTime = (Date.now() - startTime) / 1000;
                console.log(newTime)
                if (!!localStorage.getItem("bestTime") && localStorage.getItem("bestTime") !== 0) {
                    const prevBestTime = JSON.parse(localStorage.getItem("bestTime"));
                    if ( newTime > 0 && newTime < prevBestTime) {
                        localStorage.setItem("bestTime", JSON.stringify(newTime));
                        setBestTime(newTime);
                    } else {
                        setBestTime(prevBestTime);
                    }
                } else {
                    localStorage.setItem("bestTime", JSON.stringify(newTime));
                    setBestTime(newTime);
                }
                return newTime;
            });
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setRollCount(prevCount => prevCount+1);
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRollCount(0);
            setCurrentTime(0);
            setStartTime(Date.now())
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            if (die.id === id) {
                return { value: die.value, isHeld: !die.isHeld, id: die.id }
            } else { 
                return die
            }
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <div className="info">
                <p>Current Time: {currentTime === 1000 ? 0 : currentTime}s</p>
                <p>Best Time: {bestTime === 1000 ? 0 : bestTime}s</p>
                <p>Roll Counter: {rollCount}</p>
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}