const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
  },
  filmId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

commentSchema.methods.timeSinceCreation = function () {
  return Math.round((Date.now() - this.createdAt) / 1000 / 60);
};

module.exports = mongoose.model('Comment', commentSchema);
