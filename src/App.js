// import { Text } from './components/text';
import wordsService from './services/words'
import React, { useState, useEffect } from 'react'

const Text = function({text}) {

  
  // const getText = async function() {
  //   const text = await wordsService.getText();
  //   setText(text);
  //   // return text;
  // }

  // getText();
  // console.log(text);
  return (
    <div>
      <p>{'Insert text'}</p>
      {text.title}
      {text.body}
    </div>
  )
}



function App() {
  const [text, setText] = useState([]);
  const [words, setWords] = useState([]);


  useEffect(() => {
    wordsService.getText().then(text => setText(text))
    wordsService.getWordsFromText().then(words => setWords(words))
  }, [])

  console.log(words)
  return (
    <>
      <p>{'Insert text here'}</p>
      <Text text={text}/>
      {/* {words} */}
    </>
  )
}

export default App;
