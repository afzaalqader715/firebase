var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var firebase = require('firebase');

// import swagger

var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

// import routes
// var userRouter = require('./api/v1/routes/user.route');

// import db connection
// const Db = require('./server/boot/db.connection');

// import middleware 
// const auth = require('./server/middleware/auth');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use swagger
app.use('/v1/explorer', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// use routes
// app.use('/v1/users', userRouter);

// config firebase
var firebaseConfig = {
    apiKey: "AIzaSyBfRwALFi6wsiU-N6oh8jx_qnfphz2HlRs",
    authDomain: "test-firebase-c352b.firebaseapp.com",
    projectId: "test-firebase-c352b",
    databaseURL: 'https://test-firebase-c352b-default-rtdb.firebaseio.com/',
    storageBucket: "test-firebase-c352b.appspot.com",
    messagingSenderId: "741859333461",
    appId: "1:741859333461:web:3896825025eea9872d0bdc"
  };

  firebase.initializeApp(firebaseConfig);
  let database = firebase.database();

  app.get('/', async (req, res) => {
      res.send("Index");
  });

  app.post('/', async (req, res) => {
      let user_name = req.body.user_name;
      database.ref('user/'+req.body.user_name).set({
          name: req.body.name,
          user_name: user_name,
          age: req.body.age
      });
      res.send(req.body);
  });

require('expressjs-api-explorer')(app, express);

// import Console.Log
const ConsoleLog = require('./public/javascripts/console.log');

// db migration
// Db.sync({
//     // // //  force: true,  // -- Note: Warning! This will re-create the complete database and data will be lost.
//     // alter: true, // -- Use when you want to update table schema without loosing the data.
// }, (req, res) => {
//     ConsoleLog('db sync perform');
// });


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

module.exports = app;