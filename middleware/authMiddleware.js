const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decryptedToken = jwt.verify(token,process.env.JWT_SECRET);
        req.body.userId=decryptedToken.userId;
        next();
    } catch (error) {
        res.status(401).send({
            message:"You are not authorized to access",
            data:error,
            success:false,
        });
    }
};