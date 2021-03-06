const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const index = require('./routes/index');
const users = require('./routes/users');
const theories = require('./routes/saltytheories');
const configFile = require('./botconfig');
const app = express();

const RedisOptions = {
    host: "bradbot2.redis.cache.windows.net",
    port: 6379,
    pass: "H24UtVLfLbgrlqZKu5U1iV230KGHgKIwupM7GSpa/mg="
};


// view engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    store: new RedisStore(RedisOptions),
    secret: "secret",
    rolling: true,
    resave: true,
    saveUninitialized: true
}));

app.use('/', index);
app.use('/theories', theories);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
