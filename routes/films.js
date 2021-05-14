const express = require('express');
const fetch = require('node-fetch');
const User = require('../models/user');
const Comment = require('../models/comments');
const Rating = require('../models/ratings');

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

    const getRatings = await Rating.find({ film: id }).populate('user');
    const ratingByFilm = getRatings.filter(
      (el) => el.user.username.includes(req.session.user?.username),
    );
    const ratingObj = ratingByFilm[0];

    const getUser = await User.findById(req.session.user?.id);
    const isAdded = getUser?.trackedFilms.some((el) => el === id);

    const getAllComments = await Comment.find().populate('author');
    const commentsByFilm = getAllComments.filter((el) => el.filmId?.includes(id));

    const releaseDate = result.release_date.slice(0, 4);
    const replacedDate = result.release_date.replace(/\-/ig, '/');
    const duration = getTimeFromMins(result.runtime);

    const allGenres = [];
    result.genres.forEach((el) => allGenres.push(el.name));
    const showGenres = allGenres.join(', ');

    const getVideo = videoResult.results[0];

    res.render('films/single', {
      result,
      releaseDate,
      showGenres,
      replacedDate,
      duration,
      getVideo,
      commentsByFilm,
      isAdded,
      ratingObj,
      isModal: true,
      isTrack: true,
    });
  })
  .post(async (req, res) => {
    const { id } = req.body;
    try {
      await User.findByIdAndUpdate(
        req.session.user.id,
        { $push: { trackedFilms: id } },
      );
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  })
  .delete(async (req, res) => {
    const { id } = req.body;
    try {
      const user = await User.findById(req.session.user.id);
      const filmIndex = user.trackedFilms.indexOf(id);
      user.trackedFilms.splice(filmIndex, 1);
      await user.save();

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(501);
    }
  });

router
  .route('/:id/ratings')
  .post(async (req, res) => {
    const { rate, id } = req.body;
    try {
      await Rating.create(
        {
          user: req.session.user.id,
          film: id,
          rate,
        },
      );
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(501);
    }
  })
  .put(async (req, res) => {
    const { rate, id } = req.body;
    try {
      // const getRating = await Rating.find({ film: id }).populate('user');
      // const sorted = getRating.filter(
      //   (el) => el.user.username.includes(req.session.user?.username),
      // );
      await Rating.findOneAndUpdate(
        { film: id, user: req.session.user?.id }, { rate: rate },
      );
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(501);
    }
  });

router
  .route('/comment/:id')
  .post(async (req, res) => {
    const { content, id } = req.body;

    try {
      await Comment.create(
        {
          author: req.session.user.id,
          content,
          filmId: id,
        },
      );
      const getComment = await Comment.find({ filmId: id }).sort({ createdAt: -1 }).populate('author');
      // const commentTime = comment.timeSinceCreation;
      const lastComment = getComment[0];

      res.status(200).json({ lastComment });
    } catch (error) {
      console.log(error);
      res.sendStatus(501);
    }
  });

module.exports = router;
