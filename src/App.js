import wordsService from './services/words'
import React, { useState, useEffect } from 'react'


const Word = function ({ word, status, cycleState }) {
  // const cycleState = function(event) {
  //   const word = event.target.textContent;
  //   console.log(word)
  // }

  return <span onClick={cycleState} className={status + ' word'}>{word}</span>
};


const Phrase = function ({ phrase, status, markedWords, cycleState }) {
  const parts = phrase.split(' ');

  return (
    <span onClick={cycleState} className={status + ' phrase'}>
      {
        parts.map((word, index, array) => <><Word key={word + index} word={word} status={markedWords[word.toLowerCase()]} />{index === array.length - 1 ? '' : ' '}</>)
      }
    </span>
  )
};


const Paragraph = function({ paragraph, words, cycleState }) {
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
          if (token.match(phraseRegExp)) return <Phrase cycleState={cycleState} key={token + index} phrase={token} markedWords={markedWords} status={markedWords[token.toLowerCase()]} />;
          if (token.match(wordRegExp)) return <Word cycleState={cycleState} key={token + index} word={token} status={markedWords[token.toLowerCase()]} />;
          return <span key={token + index}>{token}</span>;
        })
      }
    </p>
  );  
}


const TextBody = function ({ text, words, cycleState }) {
  const paragraphs = text?.split('\n');

  return (
    <div>
      {
        paragraphs.map((paragraph, index) => <Paragraph cycleState={cycleState} key={index} paragraph={paragraph} words={words} />)
      }
    </div>
  );
};

function App() {
  const [text, setText] = useState('');
  const [words, setWords] = useState([]);

  const cycleState = function(event) {
    const word = event.target.textContent;
    const wordObj = words.filter(wordObj => wordObj.word === word);
    if (wordObj.length > 0) {
      const wordObject = wordObj[0];

      if (wordObject.state === undefined) {
        wordObject.state = 'learning';
      } else if (wordObject.state === 'familiar') {
        wordObject.state = 'learned';
      } else if (wordObject.state === 'learned') {
        wordObject.state = 'learning';
      } else if (wordObject.state === 'learning') {
        wordObject.state = 'familiar';
      }

      const updatedWords = [...words.filter(wordObj => wordObj.word !== word), wordObject];
      setWords(updatedWords)
    }
  }

  const getWordsAndText = function() {
    wordsService.getText().then(text => setText(text.body))
    wordsService.getWordsFromText().then(words => setWords(words))
  }

  useEffect(getWordsAndText, [])
  // console.log(words)
  return (
    <>
      {text && <TextBody cycleState={cycleState} text={text} words={words} />}
    </>
  );

}

export default App;
