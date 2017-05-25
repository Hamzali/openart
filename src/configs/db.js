const mongoose = require('mongoose');

module.exports = app => {

    // database connection.
    // MONGODB_URI=mongodb://root:root@ds123371.mlab.com:23371/heroku_g8dv2h6c
    mongoose.Promise = global.Promise;

    if (process.env.NODE_ENV === 'test') process.env.MONGODB_URI = 'mongodb://localhost/test';
    // console.log(process.env.MONGODB_URI = 'mongodb://db/prod');
    mongoose.connect(process.env.MONGODB_URI || ('mongodb://db/' + process.env.NODE_ENV));
    // mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/' + 'test');

    mongoose.connection.on('error', (err) => {
        console.log('MongoDB Connection Error: ' + err);
        process.exit(1);
    });

    app.mongoose = mongoose;

    return this;
};