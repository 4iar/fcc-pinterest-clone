"use strict";
const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const _ = require('lodash');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const strategy = require('./setup-passport');
const shortid = require('shortid');

// setup db
const port = process.env.PORT || 5000;
const MongoClient = mongodb.MongoClient;
const mongolabUri = process.env.MONGODB_URI;
let db;

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({ extended: true }))
app.use(cookieParser());
// See express session docs for information on the options: https://github.com/expressjs/session
app.use(session({ secret: process.env.AUTH0_CLIENT_SECRET, resave: false,  saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Auth0 callback handler
app.get('/callback', passport.authenticate('auth0', { failureRedirect: '/broke' }), (request, response) => {
  console.log(request.query);
  if (!request.user) {
    throw new Error('user null');
  }

  response.redirect("/home");
});

app.get('/api/auth/currentuser', (request, response) => {
  if (!request.user) {
    response.json({status: 'error', message: 'not logged in'});
  } else {
    response.json({status: 'success', message: 'logged in', userId: request.user.id});
  }
})



app.get('/api/posts', (request, response) => {
  db.collection('posts').find(null, {_id: false}).toArray((dbError, dbResult) => {
    if (dbError) {
      response.json({status: 'error', message: 'problem talking to the database'});
    } else if (dbResult) {
      response.json({status: 'success', message: 'fetched all posts', posts: dbResult});
    }
  })
})



app.get('*', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

MongoClient.connect(mongolabUri, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(port);
})
