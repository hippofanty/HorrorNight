const express = require('express');
const fetch = require('node-fetch');
const User = require('../models/user');
const { sessionChecker } = require('../middleware/auth');

const router = express.Router();

router
  .route('/watchlist')
  .get(sessionChecker, async (req, res) => {
    const user = await User.findById(req.session.user.id);
    const userFilms = user.trackedFilms;

    const trackedFilms = [];
    for (let i = 0; i < userFilms.length; i += 1) {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${userFilms[i]}?api_key=${process.env.API_KEY}&append_to_response=videos&language=ru`)
      const result = await response.json();
      trackedFilms.push(result);
    }

    res.render('profile/index', { trackedFilms, isProfile: true });
  });

router
  .route('/ratings')
  .get(sessionChecker, async (req, res) => {
    res.render('profile/ratings');
  });

module.exports = router;
