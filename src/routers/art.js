const Router = require('express').Router;

module.exports = app => {
    const router = new Router();

    const Art = app.models.art;
    const auth = app.middlewares.auth;


    // TODO: Refactor the error messages
    // all art pieces.
    router.get('/', (req, res) => {
        Art.findArts().then((data) => {
            res.send(data);
        }).catch((err) => {
            console.log(err);
            res.status(400).send({ 'message': 'cannot retrieve the arts.' });
        });
    });

    // create an art piece.
    router.post('/', auth);
    router.post('/', (req, res) => {
        
        // validate the inputs.
        req.checkBody('title', 'Invalid title').notEmpty().isString();
        req.checkBody('description', 'Invalid description').notEmpty().isString();
        req.checkBody('content', 'Invalid content').notEmpty().isString();

        // check validation.
        req.getValidationResult().then((result) => {
            if (!result.isEmpty()) {
                // There is a validation error
                res.status(403).send({ 'errors': result.array() });
                return;
            }

            Art.create(req.body)
            .then((data) => {            
                res.send({
                    id: data.id
                });
            })
            .catch((err) => {
                console.log(err);
                // there is an error with the database or model.
                res.status(400).send({ 'message': 'could not save the data.' });
            });

        });

        

    });

    // retrieve an art piece with an id.
    router.get('/:id', (req, res) => {

        Art.findById(req.params.id)
        .then((data) => {
            // if the data is not exists throw error
            if (!data) throw new Error('invalid data retrieved from db.');
            res.send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ 'message': 'Id is not found, Please send a valid id.' });
        });

    });

    
    // remove an art piece wit id.
    router.delete('/:id', auth);
    router.delete('/:id', (req, res) => {

        Art.remove(req.params.id)
        .then((data) => {
            if (!data) throw new Error('no such data!'); 
            res.send({ 'message': 'SUCCESS' });
        })
        .catch((err) => {
            console.log(err);
            res.send('invalidx id').status(403);
        });

    });

    // TODO: Handle the error cases.
    // update values of an art piece with an id.
    router.put('/:id', auth);
    router.put('/:id', (req, res) => {
        Art.update(req.params.id)
        .then(() => {
            res.send({ message: 'SUCCESS' });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send(err);
        });
    });

    app.use('/api/art', router);
    return this;
};