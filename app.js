var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var Fingerprint = require('express-fingerprint')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest1');

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use(Fingerprint({
	parameters:[
		// Defaults
		Fingerprint.useragent,
		Fingerprint.acceptHeaders,
		Fingerprint.geoip,

		// Additional parameters
		function(next) {
			// ...do something...
			next(null,{
			'ip':this.req.ip
			})
		},
		function(next) {
			// ...do something...
			next(null,{
			'param2':'value2'
			})
		},
	]
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

// app.get('*',function(req,res,next) {
// 	// Fingerprint object
// 	console.log(req.fingerprint)
// })

module.exports = app;


