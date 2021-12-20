import axios from 'axios';
const baseUrl = 'http://localhost:3000/api/words'

const getWordsFromText = async function() {
  const request = await axios.get(`${baseUrl}/text/1/user/1`);
  return request.data;
}

const getText = async function() {
  const request = await axios.get('http://localhost:3000/api/texts/1');
  console.log(request)
  return request.data;
}

export default {
  getWordsFromText,
  getText
}