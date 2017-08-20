var {User} = require('./../models/user');

// middleware for authentication
var authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    
        User.findByToken(token).then( (user) => {
            if (!user){
                return Promise.reject(); // reject if the user can't be found.
            }
    
            req.user = user;
            req.token = token;
            next();
        }).catch((e) => {
            res.status(401).send();
        });
   
};

module.exports.authenticate = authenticate;