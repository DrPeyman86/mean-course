const multer = require('multer')//multer allows you to extract incoming files from the client. like JPGs, pdfs' etc.


//V6 V6 V6 -- optimization -- since other files may want to use an upload feature, and since multer is technically a middleware, add it to it's own file so that other files can use it easily.
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

//since the routes in post.js use the following code, export it here so that you can simply include it in the post.js as an another middleware.
module.exports = multer({storage: storage}).single("image")
