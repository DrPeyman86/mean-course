const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path');
//const Posts = require('./models/postsSql')

//UP5HYhHj42q6bDNt//mongodb password
const postsRoutes = require('./routes/post');
const userRoutes = require('./routes/user');



//no longer need Post model since we moved everything to routes/post.js
//const Post = require('./models/post')//Models should be capitalized first letter

const app = express();//create a new instance of app. the app can now be used after this point

//connect will return a promise so you can use .then and .catch
//the node-angular is the database you want this app to write to
//mongodb+srv://peyman:<password>@cluster1-lb4pq.mongodb.net/test?retryWrites=true
//peyman:UP5HYhHj42q6bDNt
//V6 v6 v6 -- process.env is special object that holds global variables. the global variables are stored in nodemon.json file.
mongoose.connect("mongodb+srv://peyman:"+ process.env.MONGO_ATLAS_PW +"@cluster1-lb4pq.mongodb.net/node-angular?retryWrites=true", {useNewUrlParser: true})
.then(()=>{
  console.log('Connected to database')
})
.catch((e)=>{
  console.log('Connection failed', e);
});

app.use(bodyParser.json());//use body-parser for all incoming requests parsing out json data
app.use(bodyParser.urlencoded({extended: false}))//if you also want to parse urlencoded. extended false means to only allow default features when you are encoding
//by default when you want to request a file from a folder stored in the backend will not be allowed. To allow a certain folder to be allowed to fetched from
//client side, use this middleware
//path just forwards this route from "/images" to "backened/images" since the client side would not know the exact path of backened code.
app.use("/images", express.static(path.join(__dirname,"images")));//if client is requesting a URL of the "/images" path, static() middlware allows this to be fetched.

//v7 v7 v7 -- deployment using the integreated approach where the bakend and front-end are in same directory. 
//you want routes to point to the static angular directory that has been created within the root directory of the project. within that directory, 
//index.html will always be rendered if the path of the app does not point to anywhere where it is being handled. 
app.use("/", express.static(path.join(__dirname, "angular")))

// app.use((req, res, next)=>{
//   console.log('First middleware');
//   next()//next is needed to continue after this middleware. Otherwise without next() the app won't continue after this middelware
// })


//use this middleware to allow CORS Cross Origin. So that no matter what the domain/port server the request is coming from, this app will allow it. By setting that header to "*", it allows it
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin', "*");//which domains are able to access the resources from backend
  //this will allow requests to be made with these special headers. The requests do not need to include these headers, but they can. and no other special header will be allowed
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");//define what methods can be sent to the backend app. OPTIONS is important because by default it sends OPTIONS method along with any other
  //method, but if you explicity define which methods can be sent like GET, POST... and then not include "OPTIONS" the app will break.
  next();//should be able to continue
})

//once you have router in app, just do this and the app will relay the routes to that file
//.use() first argument will filter what URL you are calling and only send routes with the URL beginning
//with whatever is in first argument to that routes object defined in 2nd argument
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);//any path that starts with /api/user will get re-routed to the userRoutes file
//v7 v7 v7 -- deployment using the integreated approach where the bakend and front-end are in same directory. 
//if no route was defined, it would enter the following 
//You need to set up a route in your nodeJs app.js file so that if a user enters a link not recognized by those routes, it will still render something. 
//The something would be index.html. so if a user enters /auth/login route, since it’s not handled in backend, it would just render the index.html page instead. 
app.use((req,res,next)=>{
  res.sendFile(path.join(__dirname, "angular", "index.html"))
})

//replaced all routes below with routes/posts.js router method

// //this middleware will get executed for every single post() request. and also one for .get()
// app.post("/api/posts",(req,res, next)=>{
//   //const post = req.body;
//   const post = new Post({
//     title: req.body.title,
//     content: req.body.content
//   })//the Post model gives a constructor function which we can use to instantiate that object
//   //console.log(post);
//   //option 2 - of the issue we ran into where the id was not provided when we added new post. you called a .then() after the .save() to get the createdPosts id field and send that along with the message object back to front-end
//   post.save().then((createdPost)=>{
//     //console.log(results);
//     //201 means something was stored and was ok. 200 just means everytnhing was ok
//     res.status(201).json({
//       message: "post added successfully",
//       postId: createdPost._id
//     });//you don't need to send back the .json() data but you can
//   })//the save() is provided by mongoose for all models provided. mongoose will automatically write the insert query to write to the database

// });
// //app.get();
// //app.put();

// //put requests to put a new resource altogether and replace the previous one.
// //patch to only update an existing resource with new values
// app.put('/api/posts/:id', (req,res,next)=>{
//   //since we are doing .put() create a new instance of the Post() model. so that technically the update process creates a whole new record
//   const post = new Post({
//     _id: req.body.id,//set the newly created Post to the same id as it was before
//     title: req.body.title,
//     content: req.body.content
//   })
//   //use the updateOne method to give it which _id you want to update. Second argument will replace that first record with second arguments data
//   Post.updateOne({_id: req.params.id}, post).then(result=>{
//     //console.log(result);
//     res.status(200).json({
//       message: 'Update Successful'
//     })
//   })
// })

// //when this path is called in client side, this code will run
// //app.use('/api/posts', (req, res, next)=>{ <<<<<< you could also just do app.use, but app.get is more descriptive of what you want
// app.get('/api/posts', (req, res, next)=>{
//   //res.send('Hello from express!');//send a response back to the client for every incoming request
//   // const posts = [
//   //   { id: "12431sdfasd", title: "First server-side post", content: "This coming from server"},
//   //   { id: "12152sfdsf", title: "Second server-side post", content: "This second coming from server"}
//   // ];
//   //console.log('here');
//   Post.find()
//     .then((documents)=>{
//       //console.log(documents);
//       res.status(200).json({
//         message: "Posts fetches successfully",
//         posts: documents
//       });
//     });//will return everything under that model

//   // Posts.findAll().then((posts)=>{
//   //   res.status(200).json({
//   //     message: "Posts fetched success",
//   //     posts: posts
//   //   })
//   // })


//   // res.status(200).json({
//   //   message: "Posts fetches successfully",
//   //   posts: posts
//   // });
// })

// //route to get the post info from the post edit/create page so that if the page was
// //reloaded on the edit page, it will render the post data and populate the fields without needing to
// //go back to the main page and clicking Edit button.
// app.get('/api/posts/:id',(req,res,next)=>{
//   Post.findById(req.params.id).then((post)=>{
//     if (post) {
//       res.status(200).json(post)
//     } else {
//       res.status(404).json({message: 'Post not found'})
//     }
//   })
// })

// app.delete(`/api/posts/:id`,(req,res,next)=>{
//   //console.log(req.params.id)//req.params gives you access to the params available in the url. like "id" in this case
//   Post.deleteOne({_id:req.params.id})
//     .then((result)=>{
//       //console.log(result);
//       res.status(200).json({
//         message: "post deleted"
//       })
//     });//delete the id that matches the _id in the table

// })

module.exports = app;//export the entire express app and all the middlewares
