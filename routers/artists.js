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
        });
        
    });

    // TODO: create all CRUD routers.

    return router;
};