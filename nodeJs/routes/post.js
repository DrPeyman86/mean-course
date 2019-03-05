const express = require('express');
const Post = require('.././models/post')

const router = express.Router();//call the Router() constructor

//router does the same thing as app.get, but it's more clear understanding of having route in front of your 
//method calls than app.get. 

//since this file will only get called when the URL starts with /api/posts, you can strip the "/api/posts" off
//of every router.post() router.get() or anything else within this file


//this middleware will get executed for every single post() request. and also one for .get()
router.post("",(req,res, next)=>{
    //const post = req.body;
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    })//the Post model gives a constructor function which we can use to instantiate that object
    //console.log(post);
    //option 2 - of the issue we ran into where the id was not provided when we added new post. you called a .then() after the .save() to get the createdPosts id field and send that along with the message object back to front-end
    post.save().then((createdPost)=>{
        //console.log(results);
        //201 means something was stored and was ok. 200 just means everytnhing was ok
        res.status(201).json({
        message: "post added successfully",
        postId: createdPost._id
        });//you don't need to send back the .json() data but you can
    })//the save() is provided by mongoose for all models provided. mongoose will automatically write the insert query to write to the database

});
//app.get();
//app.put();

//put requests to put a new resource altogether and replace the previous one.
//patch to only update an existing resource with new values
router.put('/:id', (req,res,next)=>{
    //since we are doing .put() create a new instance of the Post() model. so that technically the update process creates a whole new record
    const post = new Post({
    _id: req.body.id,//set the newly created Post to the same id as it was before
    title: req.body.title,
    content: req.body.content   
    })
    //use the updateOne method to give it which _id you want to update. Second argument will replace that first record with second arguments data
    Post.updateOne({_id: req.params.id}, post).then(result=>{
        //console.log(result);
        res.status(200).json({
        message: 'Update Successful'
        })
    })
})

//when this path is called in client side, this code will run
//app.use('/api/posts', (req, res, next)=>{ <<<<<< you could also just do app.use, but app.get is more descriptive of what you want
router.get('', (req, res, next)=>{
//res.send('Hello from express!');//send a response back to the client for every incoming request
// const posts = [
//   { id: "12431sdfasd", title: "First server-side post", content: "This coming from server"},
//   { id: "12152sfdsf", title: "Second server-side post", content: "This second coming from server"}
// ];
//console.log('here');
Post.find()
    .then((documents)=>{
    //console.log(documents);
    res.status(200).json({
        message: "Posts fetches successfully",
        posts: documents
    });
});//will return everything under that model

// Posts.findAll().then((posts)=>{
//   res.status(200).json({
//     message: "Posts fetched success",
//     posts: posts
//   })
// })


// res.status(200).json({
//   message: "Posts fetches successfully",
//   posts: posts
// });
})

//route to get the post info from the post edit/create page so that if the page was
//reloaded on the edit page, it will render the post data and populate the fields without needing to 
//go back to the main page and clicking Edit button.
router.get('/:id',(req,res,next)=>{
    Post.findById(req.params.id).then((post)=>{
        if (post) {
        res.status(200).json(post)
        } else {
        res.status(404).json({message: 'Post not found'})
        }
    })
})

router.delete(`/:id`,(req,res,next)=>{
//console.log(req.params.id)//req.params gives you access to the params available in the url. like "id" in this case
    Post.deleteOne({_id:req.params.id})
        .then((result)=>{
        //console.log(result);
        res.status(200).json({
            message: "post deleted"
        })
    });//delete the id that matches the _id in the table

})

module.exports = router;