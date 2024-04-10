const express = require('express');
const route = express.Router();
const authentication = require('../middleware/authentication');
route.get("/logout", authentication, (req, res)=>{
    res.clearCookie("access_token");
    return res.redirect("/login")
});
module.exports = route;