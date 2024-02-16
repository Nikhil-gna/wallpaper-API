require("dotenv").config();
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const images_routes = require('./routes/images');
const connectDB = require('./db/connect');
const multer = require('multer');
const uploads = multer({ dest: 'uploads/' });
const fileUpload = require('express-fileupload');

app.use(fileUpload({
    useTempFiles: true
}));

//setting up multer for storing the images in uploads folder
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
 
      console.log(file);
    }
  });

  const upload = multer({ storage: storage });


app.set("view engine", "ejs");

app.get('/', (req, res) => {
    // res.send('Hello World');
    res.render('home');
});

app.get('/upload', (req, res) => {
    res.render('upload');
});
// app.post('/upload',upload.single('image'), (req, res) => {
//     res.send('File uploaded');
// });
app.post('/upload', (req, res) => {
    res.send('File uploaded to database');

});

app.use("/api",images_routes);


const start = async () => {
    try {
        await connectDB();
        app.listen(port, ()=>{
           console.log( `Server is running on port :${port} `);
        })
    } catch (error) {
        console.log(error);
    }
}


start();
