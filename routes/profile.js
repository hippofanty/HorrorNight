const express = require('express');
const fetch = require('node-fetch');
const User = require('../models/user');
const { sessionChecker } = require('../middleware/auth');
const Rating = require('../models/ratings');

const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {
    const user = await User.findById(req.session.user.id);

    res.render('profile/info', { user, isInfo: true });
  });

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
    const user = await User.findById(req.session.user.id);
    const movies = await Rating.find({ user: req.session.user?.id });

    const ratedFilms = [];
    for (let i = 0; i < movies.length; i += 1) {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movies[i].film}?api_key=${process.env.API_KEY}&append_to_response=videos&language=ru`)
      const result = await response.json();
      ratedFilms.push({ ...result, myRating: movies[i].rate });
    }

    res.render('profile/ratings', { ratedFilms, isDel: true });
  })
  .delete(async (req, res) => {
    const { id } = req.body;
    console.log(id);
    try {
      const ratings = await Rating.findOneAndDelete({ film: id, user: req.session.user?.id });
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });

module.exports = router;
