require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const images_routes = require("./routes/images");
const connectDB = require("./db/connect");
const fileUpload = require("express-fileupload");
const { inject } = require("@vercel/analytics");

// Middleware for file upload
app.use(fileUpload({ useTempFiles: true }));

// Set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Define routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/upload", (req, res) => {
  res.render("upload");
});

app.get("/policy", (req, res) => {
  res.render("privacyPolicy");
});

app.post("/upload", (req, res) => {
  // Tracking file upload event
  res.send("File uploaded to database");
});

// Mount API routes
app.use("/api", images_routes);

// Inject Vercel Analytics
inject();

// Connect to the database and start the server
const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port :${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
};

start();
