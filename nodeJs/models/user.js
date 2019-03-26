const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//create a blueprint for how the data should look like
const userSchema = mongoose.Schema({
    //the unique does not validate at the point of entry. like how required works where if it is not provided it will fail right there at the time when a request was made.
    //the unique at this point acts as an optimization to improve performace. Eventually we would need to write something to make sure emails are unique
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true }

});
//need to provide the uniqueValidator to the schema you have built so that when a schema is added/updated, etc. it will always run this validator plugin. so now it will validate the user email unique if
//it finds that there is an email already having the same email as the one add/updating.
userSchema.plugin(uniqueValidator);

//create the model that will use the above schema so that the model can be used throughout the app
module.exports = mongoose.model('User', userSchema);

