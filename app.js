require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const images_routes = require("./routes/images");
const connectDB = require("./db/connect");
const fileUpload = require("express-fileupload");
const { track } = require("@vercel/analytics/server");

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
    limits: { fileSize: 10 * 1024 * 1024 }, // Set the limit to 10 MB
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Define routes
app.get("/", (req, res) => {
  track(req, res, "Page View", { path: "/" });
  res.render("home");
});

app.get("/upload", (req, res) => {
  track(req, res, "Page View", { path: "/upload" });
  res.render("upload");
});

app.get("/policy", (req, res) => {
  track(req, res, "Page View", { path: "/policy" });
  res.render("privacyPolicy");
});

app.post("/upload", (req, res) => {
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

  const uploadPath = path.join("/tmp", file.name);

  file.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send(`File uploaded to ${uploadPath}`);
  });
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
