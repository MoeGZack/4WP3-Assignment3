const express = require('express');
var router = express.Router()
const ArticlesModel = require('../models/articles.js')
const UsersModel = require('../models/users.js')
const bcrypt= require('bcrypt')
const saltRounds = 10;



// Displays the login page
router.get("/", async function(req, res)
{
  // if we had an error during form submit, display it, clear it from session
  req.TPL.login_error = req.session.login_error;
  req.session.login_error = "";

  // render the login page
  res.render("login", req.TPL);
});



bcrypt.genSalt(saltRounds, function(err) {
  if (err) {
    console.error(err);
  }
});

router.post("/signup", async function(req, res){

const {username, password} = req.body;

if (!username || !password || username.length<6 || password.length<6) {
  req.session.signup_error = "Username and password are required and must be at least 6 characters long!";
  return res.redirect("login/signup");
}

 
  const hash = await bcrypt.hash(password, saltRounds);
   // add the user to the database
  await UsersModel.addUser(username, hash);
  req.session.signup_success = "Account created! Please login with your new account.";
  req.session.signup_error = "";
  res.redirect("/login/signup");

  req.session.signup_error = "Error creating account. Please try again.";
  res.redirect("/signup");

});



// Attempts to login a user
// - The action for the form submit on the login page.
router.post("/attemptlogin", async function(req, res){

const user = await UsersModel.findUser(req.body.username);


  if (!user) {
    req.session.login_error = "Invalid username and/or password!";
    return res.redirect("/login");
  }

  const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  
    if (!passwordMatch) {
      req.session.login_error = "Invalid username and/or password!";
      return res.redirect("/login");
    }
    
    
    // if we have an error, reload the login page with an error
   req.session.username = user.username;
  req.session.level = user.level;

  if (user.level === "editor") return res.redirect("/editors");
  return res.redirect("/members");
});

// Logout a user
// - Destroys the session key username that is used to determine if a user
// is logged in, re-directs them to the home page.
router.get("/logout", async function(req, res)
{
  delete(req.session.username);
  delete(req.session.level);
  res.redirect("/home");
});

router.get("/signup", async function(req, res)
{
  req.TPL.signup_error = req.session.signup_error;
  req.TPL.signup_success = req.session.signup_success;
  req.session.signup_success = "";
  req.session.signup_error = "";
  res.render("signup", req.TPL);
});



module.exports = router;
