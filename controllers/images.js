const Image = require('../models/image');
const express = require('express');

const getAllImages = async (req,res) =>{
    const myData = await Image.find({});
    res.status(200).json({myData});
};

const getAllImagesTest = async (req,res) =>{
    res.status(200).json({msg:"getting all images ( for testing )"});
};

module.exports= {getAllImages,getAllImagesTest};

// try {
//     if (req.files === null) {
//         return res.status(400).json({ msg: 'No file uploaded' });
//     }
//     const file = req.files.file;
//     const result = await cloudinary.uploader.upload(file.tempFilePath);
//     console.log(result);
//     const newImage = new Image({
//         name: file.name,
//         url: result.secure_url,
//         size: file.size,
//         tags: ['tag1', 'tag2'],
//         categories: ['cat1', 'cat2']
//     });
//     const savedImage = await newImage.save();
//     res.status(201).json({ image: savedImage });
// } catch (error) {
//     console.log(error);
//     res.status(500).json({ msg: 'Server Error' });
// }