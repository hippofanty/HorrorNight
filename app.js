const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dbConnect = require('./db/config');
const { cookiesCleaner } = require('./middleware/auth');
require('dotenv').config();

// Импортируем роуты
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const filmsRouter = require('./routes/films');

// Создаем объект приложения
const app = express();
// Создаем соединение с базой данных
dbConnect();

// Сообщаем express, что в качестве шаблонизатора используется "hbs".
app.set('view engine', 'hbs');
// Сообщаем express, что шаблоны шаблонизатора находятся в папке "ПапкаПроекта/views".
app.set('views', path.join(__dirname, 'views'));
app.set('cookieName', 'user_sid');

// Подключаем middleware morgan с режимом логирования "dev" (вывод запросов в консоль)
app.use(logger('dev'));
// Подключаем middleware, для инициализации статических файлов
app.use(express.static(path.join(__dirname, 'public')));
// Подключаем middleware, для чтения body из HTTP-запросов типа POST, PUT и DELETE.
app.use(express.urlencoded({ extended: true }));
// Подключаем middleware, для чтения формата JSON в body HTTP-запроса.
app.use(express.json());

app.use(cookieParser());

app.use(
  session({
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    name: app.get('cookieName'),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  }),
);

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.username = req.session.user?.username;
    res.locals.id = req.session.user?.id;
  }
  next();
});

app.use(cookiesCleaner);

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/films', filmsRouter);

app.use((req, res, next) => {
  const error = createError(404, 'Запрашиваемой страницы не существует на сервере.');
  next(error);
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log('Сервер запущен. Порт:', port);
});

module.exports = app;
