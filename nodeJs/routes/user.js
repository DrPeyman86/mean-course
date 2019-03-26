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
  User.findOne({ email: req.body.email })
    .then((user)=>{
      //if user is found, then a user exists
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      //below means user was found
      return jwt.verify(user.password, 'ssshhh')
    })
})

module.exports = router;
