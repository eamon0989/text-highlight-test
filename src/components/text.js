import React, { useState } from 'react'
import wordsService from '../services/words'

export const Text = function() {
  // const [words, setWords] = useState([]);
  const [text, setText] = useState([]);
  useEffect(() => {
    
  })
  const getText = async function() {
    const text = await wordsService.getText();
    setText(text);
    // return text;
  }

  getText();
  console.log(text);
  return (
    <div>
      <p>{'Insert text'}</p>
      {text.title}
      {text.body}
    </div>
  )
}