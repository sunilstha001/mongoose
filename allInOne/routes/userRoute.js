const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');


router.get('/profile', (req, res) =>{
    res.send("User Profile");
})

router.get("/register", (req, res) =>{
    res.render("register");
})
router.get("/login", (req, res) =>{
    res.render("login");
})

function authenticateToken(req, res, next){
    const token = req.cookies.token;
    if(!token){
        return res.redirect("/user/login");
    }
    try{
        const decoded = jwt.verify(token, "secret");
        req.user = decoded;
        next();
    } catch(err){
        res.clearCookie("token");
        return res.redirect("/user/login");
    }
}

router.get("/dashboard", authenticateToken,  (req, res) =>{
    if(req.user.role === "user"){
        res.render("dashboard", {user : req.user});
    }
    else if(req.user.role === "admin"){
        res.render("admin", {user : req.user});
    }
    else{
        res.status(401).json({message : "Unauthorized"});
    }
})

router.post('/register', async (req, res) => {
    try {
      const { userName, password } = req.body;
      if (!userName || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const existingUser = await User.findOne({ userName });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const user = new User({
        userName,
        password,
        role: "user"
      });
  
      await user.save();
  
      const token = jwt.sign(
        { userName, role: user.role, loginTime : Date.now() },
        "secret",
        { expiresIn: "1h" }
      );
  
      res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
      res.status(201).json({
        message: "User registered successfully",
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  

router.post('/login', async (req, res) =>{
    const {userName, password} = req.body;
    if(!userName || !password){
        return res.status(400).json({message : "All fields are required"});
    }
    const user = await User.findOne({userName, password});
    if(!user){
        return res.status(400).json({message : "Invalid credentials"});
    }
    const token = jwt.sign ({userName, role : user.role, loginTime : Date.now()}, "secret", {expiresIn : "1h"});
    res.cookie("token", token, {httpOnly : true, maxAge : 3600000});
    res.redirect("/user/dashboard");
})


module.exports = router;