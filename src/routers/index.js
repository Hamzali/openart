module.exports = app => {
    // index page.
    app.get('/', (req, res) => {
        res.render('index');
    });

    // not found page.
    app.get('*', (req, res) => {
        res.render('404');
    });

    return this;
};