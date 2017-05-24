const Router = require('express').Router;

module.exports = app => {
    const router = new Router();

    const Art = app.models.art;
    const auth = app.middlewares.auth;


    // all art pieces.
    router.get('/', async (req, res) => {

        try {
            const arts = await Art.findArts();
            res.json(arts);
        } catch (err) {
            console.log(err);
            res.status(400).send({ 'message': 'fail, cannot retrieve arts.' });
        }

    });

    // create an art piece.
    router.post('/', auth);
    router.post('/', async (req, res) => {
        
        // validate the inputs.
        req.checkBody('title', 'Invalid title').notEmpty().isString();
        req.checkBody('description', 'Invalid description').notEmpty().isString();
        req.checkBody('content', 'Invalid content').notEmpty().isString();
        req.checkBody('artist', 'Invalid artist').notEmpty().isString();

        const result = await req.getValidationResult();

        if (!result.isEmpty()) {
            // There is a validation error
            res.status(403).send({ 'errors': result.mapped() });
            return;
        }

        
        try {
            const id = await Art.create(req.body);
            res.json({ 
                message: 'success, art created.', 
                id: id
            });

        } catch (err) {
            console.log(err);
            res.status(400).send({ 'message': 'fail, cannot save the data.' });
        }

    });

    // retrieve an art piece with an id.
    router.get('/:id', async (req, res) => {
        try {
            const art = await Art.findById(req.params.id);
            res.json(art);
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: `fail, no art found with id: ${req.params.id}.` });
        }
    });

    
    // remove an art piece wit id.
    router.delete('/:id', auth);
    router.delete('/:id', async (req, res) => {
        const artist = req.decoded._doc;
        try {
            await Art.remove(req.params.id, artist._id);
            res.send({ 'message': `success, art with id: ${req.params.id} removed.` });
        } catch (err) {
            console.log(err);
            res.status(403).send({ message: 'fail, art is not found with id ' + req.params.id });
        }
    });

    // update values of an art piece with an id.
    router.put('/:id', auth);
    router.put('/:id', async (req, res) => {
        req.checkBody('title', 'Invalid title').optional().notEmpty().isString();
        req.checkBody('description', 'Invalid description').optional().notEmpty().isString();
        req.checkBody('content', 'Invalid content').optional().notEmpty().isString();

        const result = await req.getValidationResult();

        if (!result.isEmpty()) {
            // There is a validation error
            res.status(403).send({ 'errors': result.mapped() });
            return;
        }

        let newData = {};

        if (req.body.title) newData.title = req.body.title;
        if (req.body.content) newData.content = req.body.content;
        if (req.body.description) newData.description = req.body.description;

        // if there is no relevant data there is no need to update anyting.
        if (Object.keys(newData).length <= 0) {
            res.status(400).send({ 'message': 'fail, validation error: no data.' });
            return;
        }

        try {
            const artist = req.decoded._doc;
            
            await Art.update(req.params.id, artist._id, newData);
            res.send({ message: `success, art with id: ${req.params.id} updated.` });
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: `fail, no art found with id: ${req.params.id} or not authorized to update.` });
        }

    });

    app.use('/api/art', router);
    return this;
};