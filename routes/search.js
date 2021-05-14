const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.get('/', async (req, res) => {
  const { film } = req.query;

  const uri = encodeURI(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=ru&query=${film}&page=1&include_adult=true`);
  const response = await fetch(uri);
  const result = await response.json();

  const movieIds = result.results.filter(
    (movie) => movie.genre_ids.includes(27)
    || movie.genre_ids.includes(53)
    || movie.genre_ids.includes(9648),
  );

  res.render('films/searched', { movieIds });
});

module.exports = router;
