const jwt = require("jsonwebtoken");

module.exports = {
    checkUser: (req, res, next) => {
        const token = req.cookies.jwt;
        if(token) {
            jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, async (err, decodedToken) => {
                if(err){
                    res.locals.user = null;
                    res.cookie('jwt', '', {maxAge: 1});
                    next();
                }
                else {
                    let user = decodedToken;
                    res.locals.user = user;
                    next();
                }
            })
        }
        else {
            res.locals.user = null;
            next();
        }
    },
    requireAuth: (req, res, next) => {
        const token = req.cookies.jwt;

        if(token) {
            jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, decodedToken) => {
                if(err) {
                    throw err;
                }
                else {
                    next();
                }
            })
        } else {
            res.json({error: "No user"})
        }
    }
}