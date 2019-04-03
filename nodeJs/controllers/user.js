const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const User = require('../models/user');


exports.createUser =  (req, res, next)=>{
  //console.log('here');
  //the saltOrRounds option is like a math alrorigthm where the higher the number, the longer it will take to generate a random long number to be used as the salting option of the hash.
  bcrypt.hash(req.body.password, 10)//this returns a promise so you can just chain a .then()
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      })
      user.save()//save the user to the database
        .then(result=>{
          res.status(201).json({
            message: 'User created',
            result: result
          })
        })
        .catch(err=>{
          res.status(500).json({
            //error: {
              //V5 V5 V5 - error handling -- for the error-interceptor to correctly pick up the correct object property,
              //just send back an object with a message property when an error occurs and the error.intercept.ts will pick up the
              //value of the message and display it in the dialog
              message: 'Invalid Authentication Credentials!'
            //}
          })
        })
    })
  }


  exports.userLogin = (req, res, next)=>{
    //validate the user here
    let fetchedUser;
    User.findOne({ email: req.body.email })
      .then((user)=>{
        //if user is found, then a user exists

        if (!user) {
          return res.status(401).json({
            message: 'User not found'
          })
        }
        fetchedUser = user;//have to set this as a global variable so that you can use this user in the .then() chains below. otherwise just "user" below would not work and error
        //below means user was found
        //bcrypt.compare() returns a promise so you can just "return" it to chain another .then() block after this block
        return bcrypt.compare(req.body.password, user.password)//compare the password retrieved from the "user" in database and compare it to the password sent from the request body
      })
      .then(result=> {
        //result is the result of the bcrypt.compare() since that is what was returned from the previous .then() block
        if (!result) {
          return res.status(401).json({
            message: 'Auth failed due to mismatch passwords'
          })
        }
        //enteres here if the user was authenticated so need to create a token that is hashed
        //use jwt.sign to create either a string or object that would be sent back to the client. you can store the email, maybe not the password since its sensitive, even though it is encrypted, not good idea.
        //and the userId so that we can identify the userid in the client.
        //second argumnet is the secret passphrase, called SALTING.
        //expiresIn is an option that you can send like 1h for 1 hour which means that token will expire in 1 hour.
        //v4 v4 v4 -- since the jwt.sign method created an object with email, userId property, we know when we do jwt.verify() we can retrieve them back as regular strings, do this in check-auth.js
        //V6 V6 V6 -- optimization -- adding global variables to app to remove hardcoded from throughout the app. global variables are accessed through a special object "process.env" and there whatever name
        //of your property defined in nodemon.json was, is what it will be called here
        const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, process.env.JWT_KEY, {expiresIn: "1h"})
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id//V4 V4 V4 -- pass the userId back to the front end after the login so that the userId can be used for stricting access to buttons (edit,delete);
        })
      })
      .catch(err=>{
        //console.log(err);
        return res.status(401).json({
          message: 'Auth failed due to error in process'
        })
      })
  }
