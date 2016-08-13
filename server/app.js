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
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS, PATCH');
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

app.post('/api/posts', (request, response) => {
   if (!request.user) {
    response.json({status: 'error', message: 'not logged in'});
  }
  
  const userId = request.user.id;  
  const imageUrl = request.body.imageUrl;
  const title = request.body.title;
  
  if (!imageUrl) {
    response.json({status: 'error', message: 'image url cannot be empty'});
    return;
  }
  
  const post = {
    createdByUserId: userId,
    imageUrl,
    title,
    likes: {},
    id: shortid.generate()
  };
  
  db.collection('posts').insert(post, (dbError, dbResult) => {
    if (dbError) {
      response.json({status: 'error', message: 'problem talking to the database'});
    } else if (dbResult) {
      response.json({status: 'success', message: 'post added'})
    }
  })
})

app.delete('/api/post/:id', (request, response) => {
  if (!request.user) {
    response.json({status: 'error', message: 'not logged in'});
  }
  
  const userId = request.user.id; 
  const postId = request.params.id;

  db.collection('posts').findOne({id: postId}, (dbError, dbResult) => {
    if (dbError) {
      response.json({status: 'error', message: 'problem talking to the database'});
    } else if (!dbResult) {
      response.json({status: 'error', message: 'post not found'});
    } else if (dbResult.createdByUserId === userId) {
      db.collection('posts').deleteOne({id: postId}, (dbError, dbResult) => {
        if (dbError) {
          response.json({status: 'error', message: 'problem talking to the database'});
        } else if (dbResult) {
          response.json({status: 'success', message: 'post deleted'});
        }
      })
    } else {
      response.json({status: 'error', message: "you cannot delete someone else's post"})
    }
  })
})

app.patch('/api/post/:id', (request, response) => {
  if (!request.user) {
    response.json({status: 'error', message: 'not logged in'});
  }
  
  const userId = request.user.id;
  const postId = request.params.id;
  const choice = request.body.choice;
  
  if (choice !== 'like' && choice !== 'unlike') {
    response.json({status: 'error', message: 'invalid choice'});
    return;
  }

  if (userId) {
    const likesKey = 'likes.' + userId;
    let likesObj = {};
    likesObj[likesKey] = choice === 'like' ? true : false;

    db.collection('posts').update({id: postId}, {$set: likesObj}, (dbError, dbResult) => {
      if (dbError) {
        response.json({status: 'error', message: 'problem talking to the database'});
      } else if (dbResult) {
        response.json({status: 'success', message: 'post was updated'});
      }
    })
  } else  {
    response.json({status: 'error', message: 'you are not logged in'});
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
