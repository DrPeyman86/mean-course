const express = require('express');
const postController = require('../controllers/posts');

const checkAuth = require('../middleware/check-auth')
//V6 V6 V6 -- optimization - no longer need multer here since removed it to its own middleware file
//const multer = require('multer')//multer allows you to extract incoming files from the client. like JPGs, pdfs' etc.
const extractFile = require('../middleware/fileUpload')

const router = express.Router();//call the Router() constructor

//router does the same thing as app.get, but it's more clear understanding of having route in front of your
//method calls than app.get.

//since this file will only get called when the URL starts with /api/posts, you can strip the "/api/posts" off
//of every router.post() router.get() or anything else within this file

//define the config of the multer of where you want to store
//define what mime types you expect
//V6 V6 V6 -- optimization -- since other files may want to use an upload feature, and since multer is technically a middleware, add it to it's own file so that other files can use it easily.
/*const MIME_TYPE_MAP = {
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
});*/




//.post() will run each function of every argument by order. so first it looks at the "" which is the route.
//second will run the multer(storage).single("image"): multer will extract a single file from client and it will try to find it on an "image" property in that request body
//need to send multer an object that has the key of storage and value of storage. this is the name of the const above.
//thrird will run the callback (req,res,next)
router.post("", checkAuth, extractFile, postController.createPost );
//app.get();
//app.put();

//put requests to put a new resource altogether and replace the previous one.
//patch to only update an existing resource with new values
router.put('/:id', checkAuth, extractFile, postController.updatePost )

//when this path is called in client side, this code will run
//app.use('/api/posts', (req, res, next)=>{ <<<<<< you could also just do app.use, but app.get is more descriptive of what you want
router.get('', postController.getPosts)

//route to get the post info from the post edit/create page so that if the page was
//reloaded on the edit page, it will render the post data and populate the fields without needing to
//go back to the main page and clicking Edit button.
router.get('/:id',  checkAuth, extractFile, postController.findOne)

router.delete(`/:id`,  checkAuth, extractFile, postController.deletePost)

module.exports = router;
