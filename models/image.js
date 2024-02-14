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
        width: {
            type: Number,
            minimum: 0
          },
            height: {
                type: Number,
                minimum: 0 
            },
    },
    tags: {
        type: [String],
        required: [true, 'tags must be provided']
    },
    categories: {
        type: [String],
        required: [true, 'categories must be provided']
    },
    format: {
        type: String,
        required: true
    },
    created_at: {
        type: String,
        required: true,
        // type: Date,
        // default: Date.now
    }

 // when added auth 
    // uploader: {
    //     id: ,
    //     username: 
    //     email: 
    //   },
});

module.exports = mongoose.model('Image', imageSchema);