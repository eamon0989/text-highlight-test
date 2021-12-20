import wordsService from './services/words'
import React, { useState, useEffect } from 'react'

const Word = function ({ word, status }) {
  return <span className={status + ' word'}>{word}</span>
};


const Phrase = function ({ phrase, status, markedWords }) {
  const parts = phrase.split(' ');

  return (
    <span className={status + ' phrase'}>
      {
        parts.map((word, index, array) => <><Word key={word + index} word={word} status={markedWords[word.toLowerCase()]} />{index === array.length - 1 ? '' : ' '}</>)
      }
    </span>
  )
};


const Paragraph = function({ paragraph, markedWords }) {
  const phraseFinder = `(${Object.keys(markedWords).filter(key => key.split(' ').length > 1).join('|')})`;
  const wordFinder = `(?<words>[\\p{Letter}\\p{Mark}'-]+)`;
  const noWordFinder = `(?<nowords>[^\\p{Letter}\\p{Mark}'-]+)`;
  const tokenRegExp = new RegExp(`${phraseFinder}|${wordFinder}|${noWordFinder}`, 'gui');
  const phraseRegExp = new RegExp(phraseFinder, 'gui');
  const wordRegExp = new RegExp(wordFinder, 'gui');

  const tokens = paragraph.match(tokenRegExp);
 
  return (
    <p>
      {
        tokens.map((token, index) => {
          if (token.match(phraseRegExp)) return <Phrase key={token + index} phrase={token} markedWords={markedWords} status={markedWords[token.toLowerCase()]} />;
          if (token.match(wordRegExp)) return <Word key={token + index} word={token} status={markedWords[token.toLowerCase()]} />;
          return <span key={token + index}>{token}</span>;
        })
      }
    </p>
  );  
}


const TextBody = function ({ text, words }) {
  console.log(text)
  const paragraphs = text.split('\n');
  const markedWords = {
    'of course': 'learning',
    'across the road': 'learning',
    'bareheaded': 'learning',
    'carriages': 'learning',
  };

  return (
    <div>
      {
        paragraphs.map((paragraph, index) => <Paragraph key={index} paragraph={paragraph} markedWords={markedWords} />)
      }
    </div>
  );
};

const App = function() {
  const [text, setText] = useState([]);
  const [words, setWords] = useState([]);

  useEffect(() => {
    wordsService.getText().then(text => {
      setText(text)
      console.log(text)
    })
    wordsService.getWordsFromText().then(words => setWords(words))
  }, [])

  console.log(text);
  return (
    <>
      <p>{'Insert text here'}</p>
      <TextBody text={text} words={words}/>
      {/* {words} */}
    </>
  )
}

export default App;
