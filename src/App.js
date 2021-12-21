import wordsService from './services/words'
import React, { useState, useEffect } from 'react'
import textsService from './services/userTexts'

const Word = function ({ word, status, cycleState, getSelection }) {
  return <span onMouseUp={getSelection} onClick={cycleState} className={status + ' word'}>{word}</span>
};


const Phrase = function ({ phrase, status, markedWords, cycleState, getSelection }) {
  const parts = phrase.split(' ');

  return (
    <span onClick={cycleState} className={status + ' phrase'}>
      {
        parts.map((word, index, array) => <><Word getSelection={getSelection} key={word + index} word={word} status={markedWords[word.toLowerCase()]} />{index === array.length - 1 ? '' : ' '}</>)
      }
    </span>
  )
};


const Paragraph = function({ paragraph, words, cycleState, getSelection }) {
  const markedWords = {};
  words.forEach(obj => markedWords[obj.word] = obj.state);

  const phraseFinder = `(${Object.keys(markedWords).filter(key => key.split(' ').length > 1).join('|')})`;
  const wordFinder = `(?<words>[\\p{Letter}\\p{Mark}'-]+)`;
  const noWordFinder = `(?<nowords>[^\\p{Letter}\\p{Mark}'-]+)`;
  
  const phraseRegExp = new RegExp(phraseFinder, 'gui');
  const wordRegExp = new RegExp(wordFinder, 'gui');
  const tokenRegExp = new RegExp(`${phraseFinder}|${wordFinder}|${noWordFinder}`, 'gui');  

  const tokens = paragraph.match(tokenRegExp);

  return (
    <p>
      {
        tokens.map((token, index) => {
          if (token.match(phraseRegExp)) return <Phrase getSelection={getSelection} cycleState={cycleState} key={token + index} phrase={token} markedWords={markedWords} status={markedWords[token.toLowerCase()]} />;
          if (token.match(wordRegExp)) return <Word getSelection={getSelection} cycleState={cycleState} key={token + index} word={token} status={markedWords[token.toLowerCase()]} />;
          return <span key={token + index}>{token}</span>;
        })
      }
    </p>
  );  
}


const TextBody = function ({ text, words, cycleState, getSelection }) {
  const textBody = text.body;
  const paragraphs = textBody?.split('\n');

  return (
    <div>
      {
        paragraphs.map((paragraph, index) => <Paragraph getSelection={getSelection} cycleState={cycleState} key={index} paragraph={paragraph} words={words} />)
      }
    </div>
  );
};

const IndividualText = function({ text, openText }) {
  return (
    <li onClick={(event) => openText(event, text)}>
      <h2>{text.title}</h2>
      <p>{text.body}</p>
    </li>
  )
}

const UserTexts = function({ openText }) {
  const [texts, setTexts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const getUserTexts = function() {
    textsService.getAllUserTexts().then(texts => {
      setTexts(texts)
      setIsLoaded(true)
    })
  }

  useEffect(getUserTexts, [])

  if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <ul>
        <div>Loaded</div>
        {texts.map(text => <IndividualText key={text.id} openText={openText} text={text} />)}
      </ul>
    )
  }
}

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
      const newWordObj = {word: `${word}`, state: 'learning'}
      const updatedWords = [...words, newWordObj];
      setWords(updatedWords)
    }
  }

  const getSelection = function(event) {
    // gets the selection string
    let selectedString = window.getSelection().toString()
    const startNode = window.getSelection().anchorNode
    const endNode = window.getSelection().focusNode
    console.log(startNode)
    console.log(endNode)
    const startWord = startNode.textContent
    const endWord = endNode.textContent

    // ensures the first and last words are whole words
    const stringArray = selectedString.split(' ');
    stringArray[0] = startWord;
    stringArray[stringArray.length - 1] = endWord;
    const newPhrase = stringArray.join(' ').trim()

    // adds the phrase to words with state: learning
    const newWordObj = {word: `${newPhrase}`, state: 'learning'}
    console.log(newWordObj)
    const updatedWords = [...words, newWordObj];
    setWords(updatedWords)
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
