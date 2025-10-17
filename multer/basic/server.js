const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve uploaded files

// Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (req.path === "/uploadProfile") {
            cb(null, "uploads/profilePic");
        } else if (req.path === "/uploadScreenshot") {
            cb(null, "uploads/screenshots");
        } else if(req.path === "/uploadDocuments"){
            cb(null, "uploads/documents")
           
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
     storage: storage,
     fileFilter : (req, file, cb) =>{
        if(req.path === "/uploadDocuments"){
            if(file.mimetype.startsWith("image/")){
                console.log(path.extname(file.originalname))
                return cb(new Error("Not valid documents"), false)
            }
        }
        cb(null, true);
     }
    });

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

// Single file upload (profile pic)
app.post("/uploadProfile", upload.single("profileImage"), (req, res) => {
    if (!req.file) return res.send("No file uploaded");
    console.log(req.file.mimetype)
    res.send("Profile picture uploaded successfully!");
});

// Multiple files upload (screenshots)
app.post("/uploadScreenshot", upload.array("uploadScreenshot", 3), (req, res) => {
    if (!req.files || req.files.length === 0) return res.send("No files uploaded");
    res.send(`${req.files.length} screenshots uploaded successfully!`);
});


app.post("/uploadDocuments", upload.single("documents"), (req, res) => {
    if (!req.file) return res.send("No file uploaded");
    console.log(req.file.mimetype)
    
    res.send("Documents");
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
