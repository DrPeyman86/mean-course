const express = require('express');
const multer = require('multer')//multer allows you to extract incoming files from the client. like JPGs, pdfs' etc.
const Post = require('.././models/post')
const checkAuth = require('../middleware/check-auth')

const router = express.Router();//call the Router() constructor

//router does the same thing as app.get, but it's more clear understanding of having route in front of your
//method calls than app.get.

//since this file will only get called when the URL starts with /api/posts, you can strip the "/api/posts" off
//of every router.post() router.get() or anything else within this file

//define the config of the multer of where you want to store
//define what mime types you expect
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}
const storage = multer.diskStorage({
    //destination expects those arguments. when multer tries to save a file it runs this function
    //need to call the callback to tell where you should store the file
    //first argument of callback is whether you detect an error. second is where it should be stored
    //the path is relative of your server root directory.
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];//this will return either true or false if it finds the file.mimetype is inside of MIME_TYPE_MAP
        let error = new Error('Invalid mime type');
        if(isValid){
            error = null;
        }
        callback(error, "nodeJs/images");
    },
    filename: (req, file, callback)=>{
        const name = file.originalname.toLowerCase().split(' ').join('_');//originalname is a default property of what multer provides. and also .split(' ').join('_') to remove whitespace and replace with dash
        const ext = MIME_TYPE_MAP[file.mimetype];//get the extension. file.mimetype is default property of multer
        callback(null, name + '-' + Date.now() + '.' + ext);
    }
});

//.post() will run each function of every argument by order. so first it looks at the "" which is the route.
//second will run the multer(storage).single("image"): multer will extract a single file from client and it will try to find it on an "image" property in that request body
//need to send multer an object that has the key of storage and value of storage. this is the name of the const above.
//thrird will run the callback (req,res,next)
router.post("",
    checkAuth,
    multer({storage: storage}).single("image"),
    (req,res, next)=>{
        //const post = req.body;
        //req.protocol picks up the req of whether it was http or https
        const url = req.protocol + '://' + req.get("host");//this constructs a URL in the server
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            imagePath: url + "/images/" + req.file.filename,//add the imagepath to the Post model
            creator: req.userData.userId
        })//the Post model gives a constructor function which we can use to instantiate that object
        //console.log(post);
        //option 2 - of the issue we ran into where the id was not provided when we added new post. you called a .then() after the .save() to get the createdPosts id field and send that along with the message object back to front-end

        //console.log(req.userData);
        //return res.status(200).json({});

        post.save().then((createdPost)=>{
            //console.log(results);
            //201 means something was stored and was ok. 200 just means everytnhing was ok
            res.status(201).json({
            message: "post added successfully",
            //postId: createdPost._id
            post: {
                /*id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath*/
                ...createdPost,//rather than above you can use the SPREAD operator to copy an object into a new object with all properties from original object into the new one
                id: createdPost._id
            }
        });//you don't need to send back the .json() data but you can
    })//the save() is provided by mongoose for all models provided. mongoose will automatically write the insert query to write to the database

});
//app.get();
//app.put();

//put requests to put a new resource altogether and replace the previous one.
//patch to only update an existing resource with new values
router.put('/:id',
    checkAuth,//add the middleware authentication before any other middleware below so that it will authenticate first before express tries to do anything else
    multer({storage: storage}).single("image"),
    (req,res,next)=>{
        //since we are doing .put() create a new instance of the Post() model. so that technically the update process creates a whole new record
        //console.log(req.file);

        //set the imagePath to default req.body.imagePath which is the string version in case the image was not updated in the edit menu.
        let imagePath = req.body.imagePath;
        //req.file would be undefined if we are submitting a string, so req.file would be false if no file is detected. if file was sent, req.file would be true
        //and it would enter the if, so that we can set the imagePath accordingly.
        if(req.file) {
            const url = req.protocol + "://" + req.get("host");
            imagePath = url + "/images/" + req.file.filename;
        }

        const post = new Post({
            _id: req.body.id,//set the newly created Post to the same id as it was before
            title: req.body.title,
            content: req.body.content,
            imagePath: imagePath
        })
        //console.log(post);
        //use the updateOne method to give it which _id you want to update. Second argument will replace that first record with second arguments data
        //V4 V4 V4 -- to not allow a user to update a post that is not assigned as the creator, you can add the criteria of the creator to the updateOne() method.
        //so updateOne will update only if it finds that _id having a creator ID that was passed in from the client.
        //we get the req.userData.userId from the checkAuth middleware since that adds a new property to the req object so we can use it here.
        Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result=>{
            //console.log(result);
            //V4 V4 V4 -- result.nModified returns from mongoose when you try to updateOne(). there it gives a property nModified which tells us how many records weere updated. That is what we will use to determine if
            //an update took place.
            if(result.nModified > 0 ) {
                res.status(200).json({
                Message: 'Update Successful'
              })
            } else {
                res.status(401).json({
                message: 'User does not have access to update this post'
              })
            }

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
    //console.log(req.query);//this will hold the query param information, anything that comes afte the "?" sign in the URL.
    const pageSize = +req.query.pagesize;//a + sign in front of an string would turn it into a numeric type. If it is a numeric!
    const currentPage = +req.query.currentPage;
    //mongoose allows you to structure queries by chaining multple query methods which will narrow down your query
    //by default we want Post.find() where it finds all posts
    const postQuery = Post.find();
    let fetchedPosts;
    //if pageSize and currentPage are passed through the request enter here
    if (pageSize && currentPage) {
        //we want to manipulate the postQuery return here since we have pageSize and currentPage
        postQuery
        .skip(pageSize * (currentPage - 1))//.skip would skip a number defined in .skip() by the index of the items in the table/document. So pageSize if it's 10, and currentPage is 2. 2-1 would be 1. Multiply by 10 would be 10. So it would skip the first 10 items.
        //if pageSize is 10 and page is 3. 3-1 = 2. Multiply 10 would be 20. So it would skip first 20 indexed items.
        .limit(pageSize);//this would limit the amount of items returned. However, this still queries all items in a table first, then limits it. So may not be the best efficient way of limiting.
    }
    /*
    postQuery.find()
        .then((documents)=>{
        //console.log(documents);
        res.status(200).json({
            message: "Posts fetches successfully",
            posts: documents
        });
    });//will return everything under that model
    */
    //V2 - to return the count before retuning the data/documents. chain .then() blocks to get the count as well
    postQuery.then((documents)=>{
        fetchedPosts = documents;//return the document requested. you would initialize a variable outside the .then() function so that this variable can be used outside of this scope of function
        return Post.countDocuments()//return the count of everything that is in the Post collection
    })//return Post.count() will return a promise, so you can just chain another .then() block
    .then((count)=>{
        res.status(200).json({
            message: "Posts fetches successfully",
            posts: fetchedPosts,
            maxPosts: count
        });
    })
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

router.delete(`/:id`,checkAuth,(req,res,next)=>{
//console.log(req.params.id)//req.params gives you access to the params available in the url. like "id" in this case
    //V4 V4 V4 -- want to add authorization to deletion as well same as post() where only user who created the post can delete it.
    Post.deleteOne({_id:req.params.id, creator: req.userData.userId })
        .then((result)=>{
        //console.log(result);
        //for deletion, there is not nModified in the object that comes back from deleteOne(). so use "n". You could just use "n" for the update() also to keep consistent with each other.
        if(result.n > 0 ) {
          res.status(200).json({
          Message: 'Delete Successful'
        })
        } else {
            res.status(401).json({
            message: 'User does not have access to delete this post'
          })
        }
    });//delete the id that matches the _id in the table

})

module.exports = router;