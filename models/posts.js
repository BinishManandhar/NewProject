var mongoose = require('mongoose');

const { Schema } = mongoose;
const postSchema = new Schema({
    Slug: {
        type: String,
        required: true
    },
    Title: {
        type: String,
        required: true
    },
    Details: {
        type: String
    },
    SEOTitle: {
        type: String
    },
    FeaturedImage: {
        type: String
    },
    SEODescription: String,
    Status: String,
    IsParent: String,
    Parent: String,
    Type: String
});

module.exports = mongoose.model('Post', postSchema, 'Post');