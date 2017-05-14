const Router = require('express').Router;
const jwt    = require('jsonwebtoken');

module.exports =  (Artist, secret) => {

    const router = new Router();

    router.post('/', (req, res) => {
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('password', 'Invalid password').notEmpty().isString();

        req.getValidationResult().then((result) => {
            // There is a validation error.
            if (!result.isEmpty()) {
                res.status(400).send({ 'message': 'failed, email or password invalid.' });
                return;
            }

            // Find the user.
            Artist.findByEmail(req.body.email)
            .then(data => {
                
                if (!data) {

                    // User data not exists.
                    res.status(400).send({ 'message': 'failed, email or password invalid.' });

                } else if (req.body.password === data.password) {

                    // Don't send the sensitive data with token. 
                    delete data.password;

                    // Create the token.
                    const token = jwt.sign(data, secret); // TODO: add expire date.
                    
                    // Send to the user.
                    res.send({ 
                        'message': 'success, token generated.',
                        'token': token
                    });

                } else {

                    // Passwords do not match.
                    res.status(403).send({ 'message': 'failed, email or password invalid.' });

                }
            })
            .catch(err => {
                console.log(err);
                // User data not exists in DB.
                res.status(400).send({ 'message': 'failed, email or password invalid.' });
            });


        });
        
    });

    return router;
};