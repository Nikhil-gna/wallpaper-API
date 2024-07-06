require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const images_routes = require("./routes/images");
const connectDB = require("./db/connect");
const fileUpload = require("express-fileupload");
const { track } = require("@vercel/analytics/server");

// Configure express-fileupload to use /tmp for temporary files
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
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

  // Ensure a file is uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const file = req.files.uploadedFile;

  // Move the uploaded file to /tmp
  const uploadPath = path.join("/tmp", file.name);

  file.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    // Simulate saving the file details to the database
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
