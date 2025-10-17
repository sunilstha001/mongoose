const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads")); // to serve uploaded files

// ================= Resume Upload ==================
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/resumes"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const resumeFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF allowed for resume"), false);
};

const uploadResume = multer({ storage: resumeStorage, fileFilter: resumeFilter }).single("resume");

// ================= Product Upload ==================
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/products"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const productFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") cb(null, true);
  else cb(new Error("Only JPG/PNG allowed"), false);
};

const uploadProduct = multer({
  storage: productStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: productFilter,
}).single("productImage");

// ================= Routes ==================

// Home page with resume form
app.get("/", (req, res) => {
  res.render("index", { message: null });
});

// Product upload page
app.get("/product", (req, res) => {
  res.render("product", { message: null });
});

// Resume form submit
app.post("/submit", (req, res) => {
  uploadResume(req, res, (err) => {
    if (err) return res.render("index", { message: err.message });

    const { name, email, phone } = req.body;
    if (!name || !email || !phone || !req.file) {
      return res.render("index", { message: "All fields + resume are required" });
    }

    const submission = {
      name,
      email,
      phone,
      resumePath: req.file.path,
    };

    fs.writeFileSync("submissions.json", JSON.stringify(submission, null, 2));

    res.render("index", { message: "Form submitted successfully! ✅" });
  });
});

// Product upload submit
app.post("/uploadProduct", (req, res) => {
  uploadProduct(req, res, (err) => {
    if (err) return res.render("product", { message: err.message });
    if (!req.file) return res.render("product", { message: "Product image required" });

    res.render("product", {
      message: `Uploaded successfully ✅ Path: ${req.file.path}, Size: ${req.file.size} bytes`,
    });
  });
});

// Start server
app.listen(3000, () => console.log("Server running at http://localhost:3000"));
