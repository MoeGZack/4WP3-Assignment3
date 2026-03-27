const express = require('express');
var router = express.Router()
const UsersModel = require('../models/users.js')
const ArticlesModel = require('../models/articles.js')




// Display the editors page
router.get("/", async function(req, res)
{
  req.TPL.users= await UsersModel.getAllUsers();
  req.TPL.articles = await ArticlesModel.getAllArticles();
  res.render("editors", req.TPL);
  
 
});

router.get("/deletearticle/:title", async function(req, res) {
await ArticlesModel.deleteArticle(req.params.title);
res.redirect("/editors");

});

router.get("/deleteuser/:username", async function(req, res) {
  await ArticlesModel.deleteArticlesByUser(req.params.username);
await UsersModel.deleteUser(req.params.username);
res.redirect("/editors");
});



module.exports = router;
