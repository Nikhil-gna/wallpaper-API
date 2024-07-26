require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const { track } = require("@vercel/analytics/server");
const images_routes = require("./routes/images");
const connectDB = require("./db/connect");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(
  fileUpload({
    useTempFiles: false, // Disable temp files
    limits: { fileSize: 10 * 1024 * 1024 }, // Set the limit to 10 MB
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static('public'));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Define routes
app.get("/", (req, res) => {
  track(req, res, "Page View", { path: "/" });
  res.render("home");
});

app.get('/app-ads.txt', (req, res) => {
  const txtPath= path.join(__dirname, 'public', 'app-ads.txt');
  fs.readFile(txtPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }
    res.render('index', { textContent: data });
  });
});

app.get("/upload", (req, res) => {
  track(req, res, "Page View", { path: "/upload" });
  res.render("upload");
});

app.get("/policy", (req, res) => {
  track(req, res, "Page View", { path: "/policy" });
  res.render("privacyPolicy");
});

app.get("/contact", (req, res) => {
  res.render("contactus");
});

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: email,
    to: "swiftandme@gmail.com",
    subject: `Contact Form Submission from ${name}`,
    text: `You have a new message from the contact form wallzy.vercel.app :\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.json({ success: false, message: "Failed to send email." });
  }
});

app.post("/upload", async (req, res) => {
  track(req, res, "File Uploaded", {
    file: req.body.fileName,
    user: req.user ? req.user.id : "anonymous",
  });

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const file = req.files.uploadedFile;

  // Check the file size before processing
  if (file.size > 10 * 1024 * 1024) {
    // 10 MB in bytes
    return res.status(400).send("File size exceeds the 10 MB limit.");
  }

  try {
    const result = await cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) {
          return res.status(500).send(error);
        }
        res.send(`File uploaded to Cloudinary: ${result.secure_url}`);
      })
      .end(file.data); // Upload the file buffer directly
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    res.status(500).send("Error uploading file.");
  }
});

// Mount API routes
app.use("/api", images_routes);

// Connect to the database and start the server
const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
