const morgan = require('morgan');

module.exports = app => {
    if (process.env.NODE_ENV === 'dev') {
        app.use(morgan('dev'));
    }

    return this;
};