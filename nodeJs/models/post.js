const mongoose = require('mongoose');

//create a blueprint for how the data should look like
const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
});

//create the model that will use the above schema so that the model can be used throughout the app
module.exports = mongoose.model('Post', postSchema);

