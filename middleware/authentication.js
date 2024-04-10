const jwt = require('jsonwebtoken');
function authentication (req, res, next){
    const token = req.cookies.access_token;
    if(!token) {
        return res.redirect("/login");
    }
    try{
        const data = jwt.verify(token, process.env.SECRET_KEY);
        req.user = data;
        next();
    } catch{
        res.clearCookie("access_token");
        return res.redirect("/login");
    }    
}
module.exports = authentication;