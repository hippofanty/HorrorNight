const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.get('/', async (req, res) => {
  const { film } = req.query;

  const uri = encodeURI(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=ru&query=${film}&page=1&include_adult=true&region=RU`);
  const response = await fetch(uri);
  const result = await response.json();
  // console.log(result);

  // ['января', 'февраля', 'марта', 'апреля']
  // const replacedDate = result.results.forEach((el) => el.release_date.replace(/\-/ig, ','));
  // console.log(replacedDate);
  // var d = new Date(2013, 0, 32);

  res.render('films/searched', { result });
});

module.exports = router;
