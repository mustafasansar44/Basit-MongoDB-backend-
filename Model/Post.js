const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
    title: {type: String},
    description: {type: String},
    image: {type: String},
    active: {type: Boolean},
    date: {type: Date, default: Date.now}
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;