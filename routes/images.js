const express = require('express')
const router = express.Router();
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const connectDB = require('../db/connect');
const Image = require('../models/image');


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
  });

const {getAllImages,getAllImagesTest} = require("../controllers/images");
const { create } = require('../models/image');

router.get("/upload",(req,res)=>{
    res.render('upload');
});

router.route("/").get(getAllImages);
router.route("/upload").get(getAllImages);
router.route("/testing").get(getAllImagesTest);


router.post('/upload', async (req, res) => {
    const file = req.files.photo;
    console.log(file.tempFilePath);
    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
        if (err) {
            console.log(err);
        }
        // res.json(result);
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

module.exports =router;