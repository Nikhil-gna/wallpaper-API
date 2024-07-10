const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const connectDB = require("../db/connect");
const Image = require("../models/image");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const { getAllImages, getAllImagesTest } = require("../controllers/images");

// Route to render the upload form
router.get("/upload", (req, res) => {
  res.render("upload");
});

// Routes for different image operations
router.route("/").get(getAllImages);
router.route("/upload").get(getAllImages);
router.route("/testing").get(getAllImagesTest);

// Route to handle image upload
router.post("/upload", async (req, res) => {
  const file = req.files.photo;

  // Check if file size exceeds 10MB
  if (file.size > 10 * 1024 * 1024) {
    return res.send(
      '<script>alert("File size exceeds 10MB limit."); window.history.back();</script>'
    );
  }

  // Upload high-quality image without transformations
  cloudinary.uploader
    .upload_stream({ resource_type: "image" }, async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error uploading high-quality image.");
      }

      const highQualityUrl = result.secure_url;

      // Generate and upload low-quality image
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            quality: "auto:low",
            width: 768,
            height: 1344,
            crop: "scale",
          },
          async (lowErr, lowResult) => {
            if (lowErr) {
              console.log(lowErr);
              return res.status(500).send("Error uploading low-quality image.");
            }

            const lowQualityUrl = lowResult.secure_url;

            try {
              await connectDB(process.env.MONGODB_URI);
              await Image.create({
                name: req.body.name,
                highQualityUrl,
                lowQualityUrl,
                size: { width: result.width, height: result.height },
                categories: req.body.categories,
                format: result.format,
                created_at: result.created_at,
              });
              res.redirect("/");
              console.log("Image created");
            } catch (error) {
              console.log(error);
              res.status(500).send("Error saving image data to database.");
            }
          }
        )
        .end(file.data); // Upload the file buffer directly for low-quality image
    })
    .end(file.data); // Upload the file buffer directly for high-quality image
});

module.exports = router;
