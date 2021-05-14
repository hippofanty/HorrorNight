const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  film: {
    type: String,
  },
  rate: {
    type: String,
  },
});

module.exports = mongoose.model('Rating', ratingSchema);
