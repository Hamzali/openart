const Router = require('express').Router;

module.exports = app => {
    const router = new Router();

    const Artist = app.models.artist;
    const Verify = app.models.verify;
    const auth = app.middlewares.auth;

    const sendVerification = app.configs.mailer.sendVerification;
    
    router.get('/', async (req, res) => {
        
        try {
            const data = await Artist.findArtists();
            res.json(data);

        } catch (err) {
            console.log(err);
            res.status(500).send({ 'message': 'something went wrong!' });
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            const artist = await Artist.findById(req.params.id);
            res.json(artist);
        } catch (err) {
            if (process.env.NODE_ENV !== 'test')  console.error(err);
            // couldn't find the artist with sent id!
            res.status(400).send({ 'message': 'Id is not found, please send a valid id.' });
        }
    });

    // Artist register endpoint.
    app.post('/signup', async (req, res) => {

        // validate incoming inputs.
        req.checkBody('name', 'Invalid name').notEmpty().isString();
        req.checkBody('nick', 'Invalid nick').notEmpty().isString();
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('password', 'Invalid password').notEmpty().isString();

        const result = await req.getValidationResult();
        
        if (!result.isEmpty()) {
            // There is a validation error
            res.status(403).send({ 'errors': result.mapped(), 'message': 'Validation error.' });
            return;
        }

        const params = {
            name: req.body.name,
            nick: req.body.nick,
            email: req.body.email,
            password: req.body.password
        };

        try {
            // create artist and retrieve email.
            const email = await Artist.create(params);

            // create a new token for the registered email.
            const token = await Verify.create(email);
            // res.status(500).send({ 'message': 'fail, token cannot be created.' });

            // send the token link to the user.
            await sendVerification(email, token);
            // res.status(500).send({ 'message': 'fail, mail could not be send.' });

            res.send({ 'message': 'success, registered and verification email sent.' });

        } catch (err){
            if (process.env.NODE_ENV === 'dev') console.log(err);

            if (err.name === 'ValidationError') {
                const error = err.errors.nick || err.errors.email;
                res.status(400).send({ 'message': 'fail, ' + (error.message) });
            } else {
                res.status(400).send({ 'message': 'Could not be able to save the data.' });
            }
        }
    
    });

    router.put('/:id', auth);
    router.put('/:id', async (req, res) => {
        
        req.checkBody('name', 'Invalid name').optional().notEmpty().isString();
        req.checkBody('nick', 'Invalid nick').optional().notEmpty().isString();
        req.checkBody('email', 'Invalid email').optional().notEmpty().isEmail();

        const result = await req.getValidationResult();

        if (!result.isEmpty()) {
            // There is a validation error
            res.status(400).send({ 'errors': result.mapped(), 'message': 'Validation error.' });
            return;
        }


        // create the new data to replace.
        const newData = {}; // add only relevant data.
        if (req.body.name) newData.name = req.body.name;
        if (req.body.nick) newData.nick = req.body.nick;
        if (req.body.email) newData.email = req.body.email;

        // if there is no relevant data there is no need to update anyting.
        if (Object.keys(newData).length <= 0) {
            res.status(400).send({ 'message': 'the body is empty, please send a valid info.' });
            return;
        }

        try {
            await Artist.update(req.params.id, newData);
            res.send({ 'message': 'success, artist data updated.' });
        } catch (err) {
            console.log(err);
            res.status(400).send({ 'message': 'Id is not found, please send a valid id.' });
        }
        
    });

    router.delete('/:id', auth);
    router.delete('/:id', async (req, res) => {
        try {
            await Artist.remove(req.params.id);
            res.send({ 'message': 'success' });
        } catch (err) {
            console.log(err);
            res.status(400).send({ 'message': 'Id is not found, please send a valid id.' });
        }
    });


    // set the app endpoint.
    app.use('/api/artist', router);
    
    return this;
};