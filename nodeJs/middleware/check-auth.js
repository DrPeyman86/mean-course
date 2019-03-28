const jwt = require("jsonwebtoken");


//export this function which will be a middleware which will authenticate the user that has made a request
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]//authorization is a typical name for the token. The split(" ") logic is for splitting the "Bearer sdfaskdj4tklsfs" from the token string coming in
        //from the client. Typically tokens are prefixed with a word "Bearer" to signify that this is a token followed. So that's why the split(" ")[1] and index 1 grabs the second element of that array
        jwt.verify(token, 'peymancssh')//jwt.verify() will also throw an error so it will go into the catch block if it did not verify
    } catch(e) {
        res.status(401).json({ message: "Token not verified"});
    }
    
    next();

}