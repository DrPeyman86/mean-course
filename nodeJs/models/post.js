const mongoose = require('mongoose');

//create a blueprint for how the data should look like
const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: {type: String, required: true },
    //V4 V4 V4 -- adding authorization feature. where we store the user who created the post to the Post model.
    //type is an ObjectId type from mongoose which would be of type ObjectId which is what the default type of an id of a certain document
    //ref: is the reference of what model this field will reference. So the User model id is what we want referenced here.
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

//create the model that will use the above schema so that the model can be used throughout the app
module.exports = mongoose.model('Post', postSchema);

