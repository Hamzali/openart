const jwt = require('jsonwebtoken');

module.exports = () => {

    return (req, res, next)  => {

        const token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, 'secret', (err, decoded) => {
                if (err) {
                    // Could not verify the token.
                    console.log(err);
                    res.status(403).send({ 'message': 'failed, token did not authorized provided.' });
                } else {
                    // Save the token data and go to next.
                    req.decoded = decoded;
                    next();
                }
        });
        } else {
            // No token recieved.
            return res.status(403).send({ 'message': 'failed, no token provided.' });
        }

    };
};