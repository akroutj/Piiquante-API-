// Importation du plugin 'jsonWebToken'
const jwt = require('jsonwebtoken');


// Verification du token
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID invalide !';
        } else {
            next();
        }
    } catch (error) {
        res.status(403).json({ error: error | 'Requête non autorisée !' })
    }
};