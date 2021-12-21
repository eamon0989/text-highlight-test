import axios from 'axios';
const baseUrl = 'http://localhost:3000/api/texts'

const getAllUserTexts = async function() {
  const request = await axios.get('http://localhost:3000/api/texts');
  console.log(request.data)
  return request.data;
}

export default {
  getAllUserTexts,
}