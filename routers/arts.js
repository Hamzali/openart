const router = new require('express').Router();

module.exports = (art) => {
    // all art pieces.
    router.get('/', (req, res) => {

        art.findArts().then((data) => {
            res.send(data);
        }).catch((err) => {
            console.log(err);
        });

    });

    router.post('/', (req, res) => {
        
        req.checkBody('title', 'Invalid title').notEmpty().isString();
        req.checkBody('description', 'Invalid description').notEmpty().isString();
        req.checkBody('content', 'Invalid content').notEmpty().isString();

        req.getValidationResult().then((result) => {
            if (!result.isEmpty()) {
                // There is a validation error
                res.status(403).send({ 'errors': result.array() });
                return;
            }

            
            art.create(req.body)
            .then((data) => {            
                res.send({
                    id: data.id
                });
            })
            .catch((err) => {
                console.log(err);
            });

        });

        

    });

    router.get('/:id', (req, res) => {

        art.findById(req.params.id)
        .then((data) => {
            delete data._id;
            res.send(data);
        })
        .catch((err) => {
            console.log(err);
        });

    });

    router.delete('/:id', (req, res) => {

        art.remove(req.params.id)
        .then((data) => {
            if (!data) throw new Error('no such data!'); 
            res.send({ 'message': 'SUCCESS' });
        })
        .catch((err) => {
            console.log(err);
            res.send('invalid id').status(403);
        });

    });

    router.put('/:id', (req, res) => {
        art.update(req.params.id)
        .then((data) => {
            console.log(data);
            res.send({ message: 'SUCCESS' });
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        });
    });

    return router;
};