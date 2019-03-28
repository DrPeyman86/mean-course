const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const User = require('../models/user');


const router = express.Router();//call the Router() constructor

router.post("/signup", (req, res, next)=>{
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
            error: err
          })
        })
    })
  })
  // let token = jwt.sign(req.body.password, 'ssshhh');
  // const user = new User ({
  //   email: req.body.email,
  //   password: token
  // });
  // user.save()
  // .then((result)=>{
  //   res.status(201).json({
  //     message: 'User created',
  //     result: result
  //   })
  // })
  // .catch(err=>{
  //   res.status(500).json({
  //     error: err
  //   })
  // })



router.post('/login', (req, res, next)=>{
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
      const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, 'peymancssh', {expiresIn: "1h"})
      res.status(200).json({
        token: token 
      })
    })
    .catch(err=>{
      //console.log(err);
      return res.status(401).json({
        message: 'Auth failed due to error in process'
      })
    })
})

module.exports = router;
