const Router = require('express').Router,
 jwt    = require('jsonwebtoken'),
 bcrypt = require('bcrypt');

module.exports =  app => {

    const Artist = app.models.artist;
    const router = new Router();

    router.post('/', async (req, res) => {
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('password', 'Invalid password').notEmpty().isString();

        const result = await req.getValidationResult();

        // There is a validation error.
        if (!result.isEmpty()) {
            res.status(400).send({ 'message': 'failed, email or password invalid.' });
            return;
        }
        
        try {
            const artist = await Artist.findByEmail(req.body.email);

            const isAuth = await bcrypt.compare(req.body.password, artist.password);

            if (!artist.isVerified) {
                // Artist needs to verify his/her account.
                res.status(403).send({ 'message': 'failed, verify your account.' });
            } else if (isAuth) {
                // Don't send the sensitive data with token. 
                delete artist.password;

                // Create the token.
                jwt.sign(artist, 'secret', (err, token) => { // TODO: add expire date.
                    if (err) throw err;

                    // Send to the user.
                    res.send({ 
                        'message': 'success, token generated.',
                        'token': token
                    });
                    
                });
                
            } else {
                // Passwords do not match.
                res.status(403).send({ 'message': 'failed, email or password invalid.' });
            }

        } catch (err) {
            console.log(err);
            res.status(400).send({ 'message': 'failed, email or password invalid.' });
        }
                
    });

    app.use('/auth', router);
    return router;
};