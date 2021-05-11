const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

function failAuth(res) {
  return res.sendStatus(401);
}

function serializeUser(user) {
  return {
    id: user.id,
    username: user.username,
  };
}

router
  .route('/signup')
  .get((req, res) => res.render(('auth/signup'), { isSignup: true }))
  .post(async (req, res) => {
    const { email, username, password } = req.body;
    try {
      const saltRounds = Number(process.env.SALT_ROUNDS);
      const hashedParrword = await bcrypt.hash(password, saltRounds);
      const user = await User.create({
        email,
        username,
        password: hashedParrword,
      });
      req.session.user = serializeUser(user);
      return res.sendStatus(200);
    } catch (error) {
      return failAuth(res);
    }
  });

router
  .route('/signin')
  .get((req, res) => res.render(('auth/signin'), { isSignin: true }))
  .post(async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email }).exec();
      if (!user) {
        return failAuth(res);
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return failAuth(res);
      }
      req.session.user = serializeUser(user);
      return res.sendStatus(200);
    } catch (error) {
      return failAuth(res);
    }
  });

router
  .route('/logout')
  .get((req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie(req.app.get('cookieName'));
      return res.redirect('/');
    });
  });

module.exports = router;
