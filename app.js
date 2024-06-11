var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);



var userApiRouter = require('./routes/api/user');
var adminApiRouter = require('./routes/api/admin');
var countryApiRouter = require('./routes/api/country');
var stateApiRouter = require('./routes/api/state');

var userUiRouter = require('./routes/ui/user/userIndex');
var adminUiRouter = require('./routes/ui/user/adminIndex');
var countryUiRouter = require('./routes/ui/user/countryTemplete');
var stateUiRouter = require('./routes/ui/user/stateTemplete');

var app = express();
// var bodyParser = require('body-parser')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var fileStoreOptions = {};
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
   secret: 'keyboard cat',
   resave: true,
   saveUninitialized: true,
   cookie : {
    maxAge:(1000 * 60 * 100)
  } 
}));

app.use('/api/user', userApiRouter);
app.use('/api/admin', adminApiRouter);
app.use('/api/country',countryApiRouter);
app.use('/api/state', stateApiRouter);

app.use('/user/', userUiRouter);
app.use('/admin/', adminUiRouter);
app.use('/country/',countryUiRouter);
app.use('/state/',stateUiRouter);

// const maxAge = (min) => 1000 * 60 * min
// app.use(session({ secret: 'keyboard cat',
//  cookie: { maxAge: maxAge(5) }}
// ))
// app.use(session({
//   secret: 'secret-key',
//   resave: false,
//   saveUninitialized: false
// }));


app.get('/', (req, res) => {
  if (req.session.views) {
    req.session.views++
  } else {
    req.session.views = 1
  }
  res.render('pages/home',{refresh:req.session.views});
});

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

module.exports = app;
