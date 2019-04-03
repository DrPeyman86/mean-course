const express = require('express');

//V6 V6 V6 -- optimzation - add a controller to further optimize/clean code. Previously you had all middleware in this file that is now in the controller file.
//for readability and simplicity, you would want to have them in a controller.
//adding a controller
const userController = require('../controllers/user');

const router = express.Router();//call the Router() constructor

router.post("/signup", userController.createUser)
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

router.post('/login', userController.userLogin)

module.exports = router;
