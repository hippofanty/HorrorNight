const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = () => {
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
    poolSize: 10,
    bufferMaxEntries: 0,
  }).then(() => {
    console.log('DB connected!');
  });
};
module.exports = dbConnect;
