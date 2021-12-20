// import { Text } from './components/text';
import wordsService from './services/words'
import React, { useState, useEffect } from 'react'

const Word = function({ word }) {
  return <span>{word}</span>
}

const Text = function({text}) {
  // console.log(text)
  // const words = text.split(' ');
  // console.log('words')
  // console.log(words)
  return (
    <div>
      {text}
    </div>
  )
}

function App() {
  const [text, setText] = useState([]);
  const [words, setWords] = useState([]);
  const [phrases, setPhrases] = useState([]);

  // const getPhrases = function() {
  //   console.log('gettingphrases')
  //   console.log(phrases)
  //   words.forEach(word => {
  //     if (/ /.test(word.word)) {
  //       // console.log(word)
  //       console.log(phrases)
  //       // const updatedPhrases = [...phrases];
  //       // phrases.push(word);
  //       // console.log('updatedPhrases')
  //       // console.log(updatedPhrases)
  //       setPhrases([...phrases, word])
  //     }
  //   })

  //   console.log(phrases)
  // }

  useEffect(() => {
    wordsService.getText().then(text => setText(text.body))
    wordsService.getWordsFromText().then(words => setWords(words))
  }, [])

  // useEffect(getPhrases, [words])
  // console.log(phrases)
  // console.log(text)

  return (
    <>
      <p>{'Insert text here'}</p>
      <Text text={text}/>
      {/* {words} */}
    </>
  )
}

export default App;
