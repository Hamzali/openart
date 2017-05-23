module.exports = app => {
    const Verify = app.models.verify;
    const Artist = app.models.artist;
    const sendResetPassword = app.configs.mailer.sendResetPassword;

    // TODO: refactor reset password.
    app.get('/forgotpassword', (req, res) => {
        res.render('respass-req');
    });

    app.post('/forgotpassword', async (req, res) => {
        
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        
        const result = await req.getValidationResult();
        if (!result.isEmpty()) {
            // There is a validation error
            res.render('respass-req', { 'error': 'enter a valid email.' });
            
            return;
        }
        
        let token, email;

        try {
            // find the user.
            const artist = await Artist.findByEmail(req.body.email);
            email = artist.email;
            // res.render('respass-req', { 'error': 'failed, no such user found.' });

            // if user exists create token.
            token = await Verify.create(email);
            // res.render('respass-req', { 'error': 'Ooops, something went wrong with token.' });

            res.render('respass-notify', { 'message': 'success,  reset password email sent.' });
        } catch (err) {
            console.log(err);

            if (err.name === 'ValidationError') {
                // if token already exists set token to null.
                token = null;
            } else {
                res.render('respass-req', { 'error': 'failed, no such user found.' });
                return;
            }

            
        }

        try {
            // update the token.
            if (!token) token  = await Verify.updateToken(email);
            
            // send the email to the artist.
            await sendResetPassword(email, token);
        } catch (err) {
            console.log(err);
            res.render('respass-req', { 'error': 'failed, reset password mail cannot be sent try again later.' });
        }
          
    });


    app.get('/forgotpassword/:token', async (req, res) => {

        try {
            await Verify.findAndVerify(req.params.token);
            res.render('respass');
        } catch (err) {
            console.log(err);
            res.render('respass-notify', { 'message': 'Token verification failed.' });
        }

    });
    
    app.post('/forgotpassword/:token', async (req, res) => {
        req.checkBody('password', 'invalid password').notEmpty().isString(); // TODO: write a password validation function.

        const result = await req.getValidationResult();
        if (!result.isEmpty()) {
            // There is a validation error
            res.render('respass', { 'error': 'enter a valid password.' });
            
            return;
        }

        try {
            const v = await Verify.findAndVerify(req.params.token);

            await Artist.updatePassword(v.artist, req.body.password);

            await Verify.remove(v._id);

            res.redirect('/');
            
        } catch (err) {
            console.log(err);
            res.render('respass-notify', { 'message': 'Token verification failed.' });
        }

    });

    return this;
};