const express = require('express')
const router = express.Router();

const {getAllImages,getAllImagesTest} = require("../controllers/images");


router.route("/").get(getAllImages);
router.route("/testing").get(getAllImagesTest);

module.exports =router;