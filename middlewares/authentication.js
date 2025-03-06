
const jwt = require('jsonwebtoken');
const { fetchUserById } = require('../repository/user');

exports.authenticateUser = async (req, res, next) => {
    try {
        const hasAuthorization = req.headers.authorization;
        if (!hasAuthorization) {
            return res.status(404).json({
                message: 'Token not found'
            });
        }

        const token = hasAuthorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        const user = await fetchUserById(decodedToken.userId);
        if (!user) {
            return res.status(404).json({
                message: 'Authorization Failed: User not found'
            });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.json({
                message: 'Session timeout'
            });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                message: "Invalid token"
            });

        } else {
            res.status(500).json({
                error: error.message
            });
        }
    }
    };

/*exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};*/
