const express = require('express');
const fetch = require('node-fetch');
const User = require('../models/user');

const router = express.Router();

function getTimeFromMins(mins) {
  const hours = Math.trunc(mins / 60);
  const minutes = mins % 60;
  return `${hours}h ${minutes}m`;
}

router
  .route('/')
  .get(async (req, res) => {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=ru&sort_by=popularity.desc&with_genres=27&page=1`);
    const result = await response.json();
    // console.log(result);
    res.render('index', { result });
  });

router
  .route('/:id')
  .get(async (req, res) => {
    const { id } = req.params;
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.API_KEY}&append_to_response=videos&language=ru`);
    const resVideo = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.API_KEY}&language=en-US`);
    const result = await response.json();
    const videoResult = await resVideo.json();

    const releaseDate = result.release_date.slice(0, 4);
    const replacedDate = result.release_date.replace(/\-/ig, '/');
    const duration = getTimeFromMins(result.runtime);

    const allGenres = [];
    const genres = result.genres.forEach((el) => allGenres.push(el.name));
    const showGenres = allGenres.join(', ');

    const getVideo = videoResult.results[0];

    res.render('films/single', {
      result,
      releaseDate,
      showGenres,
      replacedDate,
      duration,
      getVideo,
      isModal: true,
      isTrack: true,
    });
  })
  .post(async (req, res) => {
    const { id } = req.body;
    console.log(id);
    try {
      const user = await User.findByIdAndUpdate(
        req.session.user.id,
        { $push: { trackedFilms: id } },
      );
      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  });

module.exports = router;
