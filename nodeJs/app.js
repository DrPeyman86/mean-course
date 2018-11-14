const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

//UP5HYhHj42q6bDNt//mongodb password

const Post = require('./models/post')//Models should be capitalized first letter

const app = express();//create a new instance of app. the app can now be used after this point

//connect will return a promise so you can use .then and .catch
//the node-angular is the database you want this app to write to
mongoose.connect("mongodb+srv://peyman:UP5HYhHj42q6bDNt@cluster0-lb4pq.mongodb.net/node-angular?retryWrites=true")
.then(()=>{
  console.log('Connected to database')
})
.catch(()=>{
  console.log('Connection failed'); 
});

app.use(bodyParser.json());//use body-parser for all incoming requests parsing out json data
app.use(bodyParser.urlencoded({extended: false}))//if you also want to parse urlencoded. extended false means to only allow default features when you are encoding

// app.use((req, res, next)=>{
//   console.log('First middleware');
//   next()//next is needed to continue after this middleware. Otherwise without next() the app won't continue after this middelware
// })


//use this middleware to allow CORS Cross Origin. So that no matter what the domain/port server the request is coming from, this app will allow it. By setting that header to "*", it allows it
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin', "*");//which domains are able to access the resources from backend
  //this will allow requests to be made with these special headers. The requests do not need to include these headers, but they can. and no other special header will be allowed
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");//define what methods can be sent to the backend app. OPTIONS is important because by default it sends OPTIONS method along with any other
  //method, but if you explicity define which methods can be sent like GET, POST... and then not include "OPTIONS" the app will break.
  next();//should be able to continue
})

//this middleware will get executed for every single post() request. and also one for .get()
app.post("/api/posts",(req,res, next)=>{
  //const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  })//the Post model gives a constructor function which we can use to instantiate that object
  //console.log(post);
  post.save()//the save() is provided by mongoose for all models provided. mongoose will automatically write the insert query to write to the database
  res.status(201).json({
    message: "post added successfully"
  });//you don't need to send back the .json() data but you can
});
//app.get();
//app.put();

//when this path is called in client side, this code will run
//app.use('/api/posts', (req, res, next)=>{ <<<<<< you could also just do app.use, but app.get is more descriptive of what you want
app.get('/api/posts', (req, res, next)=>{
  //res.send('Hello from express!');//send a response back to the client for every incoming request
  const posts = [
    { id: "12431sdfasd", title: "First server-side post", content: "This coming from server"},
    { id: "12152sfdsf", title: "Second server-side post", content: "This second coming from server"}
  ];
  res.status(200).json({
    message: "Posts fetches successfully",
    posts: posts
  });
})

module.exports = app;//export the entire express app and all the middlewares
