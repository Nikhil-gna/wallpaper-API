const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name must be provided']
    },
    url: {
        type: String,
        required: [true, 'url must be provided']
    },
    size: {
        type: Number,
        required: true,
    },
    tags: {
        type: [String],
        required: [true, 'tags must be provided']
    },
    categories: {
        type: [String],
        required: [true, 'categories must be provided']
    },
    created_at: {
        type: Date,
        default: Date.now
    }

 // when added auth 
    // uploader: {
    //     id: ,
    //     username: 
    //     email: 
    //   },
});

module.exports = mongoose.model('Image', imageSchema);