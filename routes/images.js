// Import necessary modules
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const connectDB = require('../db/connect');
const Image = require('../models/image');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const { getAllImages, getAllImagesTest } = require("../controllers/images");

// Route to render the upload form
router.get("/upload", (req, res) => {
    res.render('upload');
});

// Routes for different image operations
router.route("/").get(getAllImages);
router.route("/upload").get(getAllImages);
router.route("/testing").get(getAllImagesTest);

// Route to handle image upload
router.post('/upload', async (req, res) => {
    const file = req.files.photo;

    // Check if file size exceeds 10MB
    if (file.size > 10 * 1024 * 1024) {
        // return res.render('alert', { message: 'File size exceeds 10MB limit.' });
        return res.send('<script>alert("File size exceeds 10MB limit."); window.history.back();</script>');
     
    }

    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
        if (err) {
            console.log(err);
        }

        try {
            await connectDB(process.env.MONGODB_URI);
            await Image.create({
                name: req.body.name,
                url: result.secure_url,
                size: { width: result.width, height: result.height },
                tags: req.body.tags,
                categories: req.body.categories,
                format: result.format,
                created_at: result.created_at
            });
            res.render("home");
            console.log('Image created');
        } catch (error) {
            console.log(error);
        }
    });
});

module.exports = router;
