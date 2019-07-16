var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var config = require('./config.json')
var logger = require('morgan');

var expressLayouts = require('express-ejs-layouts');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var bodyParser = require('body-parser');

var app = express();

var db = require('./db');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('*', (req, res, next) => {
  if (req.cookies.user_id && req._parsedUrl.pathname === "/index") {
    jwt.verify(req.cookies.user_id, config.SecretKey, function (err, decoded) {
      if (err) {
        console.log(err);
      } else {
        res.locals.loggedUser = decoded.LoggedUser;
        next();
      }
    });
  }
  else {
    next();
  }
});
app.use('/', loginRouter);
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.locals.loggedUser = "";

module.exports = app;
