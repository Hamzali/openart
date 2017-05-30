const mongoose = require('mongoose');

module.exports = app => {

    // database connection.
    mongoose.Promise = global.Promise;
 
    mongoose.connect(process.env.MONGODB_URI || ('mongodb://localhost/' + process.env.NODE_ENV));

    mongoose.connection.on('error', (err) => {
        console.log('MongoDB Connection Error: ' + err);
        process.exit(1);
    });

    app.mongoose = mongoose;

    return this;
};