import { useCallback, useEffect, useState } from "react"
import words from './wordList.json'
import { HangmanDrawing } from "./HangmanDrawing.tsx"
import { HangmanWord } from "./HangmanWord.tsx"
import { Keyboard } from "./Keyboard.tsx"

function getWord(){
  // This will give the random word from the list
  return words[Math.floor(Math.random()*words.length)]
}

function App() {

  const [wordToGuess, setWordToGuess] = useState(getWord)

  // get array of String
  const [gussedLetters, setGuessedLetters] = useState<string[]>([]);

  const incorrectLetters =gussedLetters.filter(
    letter => !wordToGuess.includes(letter)
  )


  const isLoser = incorrectLetters.length >=6
  const isWinner = wordToGuess.split("").every(letter => gussedLetters.includes(letter))

  const addGuessedLetter = useCallback((letter: string)=>{
    if (gussedLetters.includes(letter) || isLoser || isWinner) return
    setGuessedLetters(currentLetters => [...currentLetters,letter])
  },[gussedLetters, isLoser , isWinner])

  


  
  useEffect(() => {

    // when we press the key on our keyboard
    const handler = (e: KeyboardEvent)=>{
      const key = e.key

      // if the key is between a-z then only we will add the key.
      if (!key.match(/[a-z]/i)) return

      e.preventDefault()
      addGuessedLetter(key)
    }

    document.addEventListener('keypress',handler)

    return () => {
      document.removeEventListener('keypress',handler)
    }

  },[gussedLetters])

  useEffect(() => {

    const handler = (e: KeyboardEvent)=>{
      const key = e.key

      // if the key is between a-z then only we will add the key.
      if (key!=="Enter") return
      e.preventDefault()
      setGuessedLetters([])
      setWordToGuess(getWord())

      
    }

    document.addEventListener('keypress',handler)

    return () => {
      document.removeEventListener('keypress',handler)
    }


  },[])
  

  return (
    <div style={{
      maxWidth: "800px",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      margin: "0 auto",
      alignItems: "center",
    }}>
      <div style={{textAlign: 'center',margin: '10px 0',}}>
      <h1 style={{fontSize: '3em',color: 'darkblue',fontWeight: 'bold'}}>Hangman Game</h1>
      <p style={{fontSize: '2em', color: 'gray',}}>Guess the word before the man is hanged!</p>
    </div>

<div style={{fontSize: "2rem", textAlign: "center", padding: "0.5rem",  backgroundColor: isWinner ? "green" : isLoser ? "red" : "transparent"}}>
    {isWinner && "You Win! Refresh the page or Press Enter to try again"}
    {isLoser && "You Loss! Refresh the page or Press Enter to try again"}
</div>


      <HangmanDrawing numberOfGuesses={incorrectLetters.length}/>

      <HangmanWord reveal={isLoser} gussedLetters={gussedLetters} wordToGuess={wordToGuess}/>

      <div style={{alignSelf:"stretch"}}>


      <Keyboard 
      disabled={isWinner || isLoser}
      activeLetters= {gussedLetters.filter(letter => wordToGuess.includes(letter))}
        inactiveLetters={incorrectLetters}
        addGuessedLetter={addGuessedLetter}
      />

      </div>
      



    </div>
  )
}

export default App
