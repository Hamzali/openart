const Router = require('express').Router;

module.exports = (Artist) => {
    const router = new Router();

    router.get('/', (req, res) => {
        Artist.findArtists()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ 'message': 'something went wrong!' });
        });
        
    });

    router.get('/:id', (req, res) => {
        Artist.findById(req.params.id)
        .then(data => {
            if (!data) throw new Error('No data found!');
            res.json(data);
        })
        .catch(err => {
            if (process.env.NODE_ENV !== 'test')  console.error(err);
            // couldn't find the artist with sent id!
            res.status(400).send({ 'message': 'Id is not found, please send a valid id.' });
        });
    });

    router.post('/', (req, res) => {

        // validate incoming inputs.
        req.checkBody('name', 'Invalid name').notEmpty().isString();
        req.checkBody('nickname', 'Invalid nickname').notEmpty().isString();
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('password', 'Invalid password').notEmpty().isString();

        req.getValidationResult().then((result) => {
            if (!result.isEmpty()) {
                // There is a validation error
                res.status(403).send({ 'errors': result.array(), 'message': 'Validation error.' });
                return;
            }
            // Take only the realtive data from the body.
            const params = {
                name: req.body.name,
                nickname: req.body.nickname,
                email: req.body.email,
                password: req.body.password
            };

            Artist.create(params)
            .then(data => {      
                res.send({
                    'message': 'success, new artist created.',
                    'id': data.id
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send({ 'message': 'Could not be able to save the data.' });
            });

        });


    });

    router.put('/:id', (req, res) => {

        req.checkBody('name', 'Invalid name').optional().notEmpty().isString();
        req.checkBody('nickname', 'Invalid nickname').optional().notEmpty().isString();
        req.checkBody('email', 'Invalid email').optional().notEmpty().isEmail();

        req.getValidationResult().then((result) => {
            if (!result.isEmpty()) {
                // There is a validation error
                res.status(400).send({ 'errors': result.array(), 'message': 'Validation error.' });
                return;
            }
            
            // create the new data to replace.
            const newData = {}; // add only relevant data.
            if (req.body.name) newData.name = req.body.name;
            if (req.body.nickname) newData.nickname = req.body.nickname;
            if (req.body.email) newData.email = req.body.email;

            // if there is no relevant data there is no need to update anyting.
            if (Object.keys(newData).length <= 0) {
                res.status(400).send({ 'message': 'the body is empty, please send a valid info.' });
                return;
            }
            
            Artist.update(req.params.id, newData)
            .then(data => {
                if (!data) throw new Error('something went wrong!');

                res.send({ 'message': 'success, artist data updated.' });
            })
            .catch(err => {
                console.log(err);
                res.status(400).send({ 'message': 'Id is not found, please send a valid id.' });
            });

        });
    });


    router.delete('/:id', (req, res) => {
        Artist.remove(req.params.id)
        .then(() => {
            res.send({ 'message': 'success' });
        })
        .catch(err => {
            console.log(err);
            res.status(400).send({ 'message': 'Id is not found, please send a valid id.' });
        });
    });

    return router;
};