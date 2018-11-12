const express = require('express');

const app = express();//create a new instance of app. the app can now be used after this point

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

//when this path is called in client side, this code will run
app.use('/api/posts', (req, res, next)=>{
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
