import wordsService from './services/words'
import React, { useState, useEffect } from 'react'
import UserTexts from './components/UserTexts';
import TextBody from './components/TextBody';

const App = function() {
  const [text, setText] = useState('');
  const [words, setWords] = useState([]);

  const openText = function(_event, text) {
    setText(text)
  }

  const getWordsAndText = function() {
    wordsService.getWordsFromText(text.id).then(words => setWords(words))
  }

  useEffect(getWordsAndText, [text])

  const cycleState = function(event) {
    const word = event.target.textContent;
    const wordObj = words.filter(wordObj => wordObj.word.toLowerCase() === word.toLowerCase());

    if (wordObj.length > 0) {
      const wordObject = wordObj[0];

      if (wordObject.state === undefined) {
        wordObject.state = 'learning';
      } else if (wordObject.state === 'familiar') {
        wordObject.state = 'learned';
      } else if (wordObject.state === 'learned') {
        wordObject.state = undefined;
      } else if (wordObject.state === 'learning') {
        wordObject.state = 'familiar';
      }

      const updatedWords = [...words.filter(wordObj => wordObj.word.toLowerCase() !== word.toLowerCase()), wordObject];
      setWords(updatedWords)
    } else {
      const newWordObj = {word: `${word.toLowerCase()}`, state: 'learning'}
      const updatedWords = [...words, newWordObj];
      setWords(updatedWords)
    }
  }

  const getSelection = function(event) {
    // todo: check interaction between this and cycleState
    // fix bug where if a user selects backwards, first and last words are swapped
    // gets the selection string
    console.log(window.getSelection())
    let selectedString = window.getSelection().toString()
    const startNode = window.getSelection().anchorNode
    const endNode = window.getSelection().focusNode
    const startWord = startNode.textContent
    const endWord = endNode.textContent

    // ensures the first and last words are whole words
    const stringArray = selectedString.split(' ');
    stringArray[0] = startWord;
    stringArray[stringArray.length - 1] = endWord;
    const newPhrase = stringArray.join(' ').trim().split('.')[0]
    console.log(newPhrase)

    // adds the phrase to words with state: learning
    const newWordObj = {word: `${newPhrase.toLowerCase()}`, state: 'learning'}

    if (words.filter(wordObj => wordObj.word.toLowerCase() === newWordObj.word.toLowerCase()).length === 0) {
      const updatedWords = [...words, newWordObj];
      setWords(updatedWords)
    }
  }

  if (text) {
    return (
      <>
        {<TextBody getSelection={getSelection} cycleState={cycleState} text={text} words={words} />}
      </>
    );
  } else {
    return (
      <>
        {<UserTexts openText={openText} />}
      </>
    );
  }
}

export default App;
