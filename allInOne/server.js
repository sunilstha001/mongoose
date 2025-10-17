const express = require("express");
const app = express();
const connectDB = require("./config/connectDB");
const userRouter = require("./routes/userRoute");
const cookieParser = require("cookie-parser");

// Connect to Database
connectDB();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use("/user", userRouter);
app.use(express.static("public"));
app.set("view engine", "ejs");



app.get("/", (req, res) =>{
    res.send("Hello World !!");
})


app.listen(3000, () =>{
    console.log("Server is running on port 3000");
})