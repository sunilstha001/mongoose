const express = require("express");
const session = require("express-session");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: "mySecretKey",      // secret to sign session ID
    resave: false,               // don't save session if unmodified
    saveUninitialized: true,     // save new sessions
    cookie: { maxAge: 600000 },  // session expires in 10 minutes
  })
);

// Home route
app.get("/", (req, res) => {
  if (req.session.views) {
    req.session.views++;
  } else {
    req.session.views = 1;
  }
  res.render("index", { views: req.session.views });
});

// Login route (demo)
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  req.session.username = username; // store in session
  res.redirect("/dashboard");
});

// Dashboard route
app.get("/dashboard", (req, res) => {
  if (req.session.username) {
    res.render("dashboard", { username: req.session.username });
  } else {
    res.send("Please login first. <a href='/login'>Login</a>");
  }
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.send("Logged out successfully! <a href='/'>Home</a>");
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
