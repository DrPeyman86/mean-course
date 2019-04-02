const jwt = require("jsonwebtoken");


//export this function which will be a middleware which will authenticate the user that has made a request
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]//authorization is a typical name for the token. The split(" ") logic is for splitting the "Bearer sdfaskdj4tklsfs" from the token string coming in
        //from the client. Typically tokens are prefixed with a word "Bearer" to signify that this is a token followed. So that's why the split(" ")[1] and index 1 grabs the second element of that array
        //jwt.verify(token, 'peymancssh')//jwt.verify() will also throw an error so it will go into the catch block if it did not verify
        //v4 v4 v4 -- adding authorization to the app.
        //jwt.verify() can also verify and retrieve the decoded token based on the encrypted token along with the salt. we need that sent back as the UserId who created the post to send back to the client
        //to limit who can delete/edit posts. change above line to this.
        const decodedToken = jwt.verify(token, 'peymancssh')//jwt.verify() will also throw an error so it will go into the catch block if it did not verify
        //expressjs allows middlewares to manipulate a req body or add to it. so any route that is using this middleware, will have a new req property added here. or if you name a property that exists, it will override it.
        req.userData = { email: decodedToken.email, userId: decodedToken.userId }//we know email and userId because in user.js when we did jwt.sign() we added these two properties
        next()//call next to continue with the route and add a req property to continue on.
    } catch(e) {
        res.status(401).json({ message: "Token not verified"});
    }

}
