// TODO: improve error handling.
module.exports = app => {

    app.use((err, req, res, next) => {
        // console.error(err.stack);
        
        if (process.env.NODE_ENV === 'dev') {
            res.send(err.stack);
        } else {
            res.status(500).send('Something broke!');
        }

        next();
    });

    return this;
};