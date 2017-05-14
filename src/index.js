require('dotenv').config();
const path = require('path');

const express = require('express'),
    app = express(),
    morgan = require('morgan'),
    bodyparser = require('body-parser'),
    mongoose = require('mongoose'),
    expressValidator = require('express-validator');
    
// database connection.
// MONGODB_URI=mongodb://root:root@ds123371.mlab.com:23371/heroku_g8dv2h6c
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || (process.env.MONGODB_DEV + process.env.NODE_ENV));
mongoose.connection.on('error', (err) => {
  console.log('MongoDB Connection Error: ' + err);
  process.exit(1);
});


// Template and engine integration.
app.engine('pug', require('pug').__express);
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));


// middlewares
app.use(bodyparser.json());
app.use(
    expressValidator({
        customValidators: {
            isArray: (value) => {
                return Array.isArray(value);
            },
        
            isString: (value) => {
                return typeof value === typeof '';
            }
        }   
    })
 );

if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'));
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    next();
});

app.set('secret', 'secretissecretok');

// App routes.
app.get('/', (req, res) => {
    res.render('index');
});

// Initialize models with ORM.
let Art = require('./models/arts')(mongoose);
let Artist = require('./models/artists')(mongoose);

// Initialize routers with relative models.
let arts = require('./routers/arts')(Art);
let artists = require('./routers/artists')(Artist);
let auth = require('./routers/auth')(Artist, app.get('secret'));

app.use('/auth', auth);
app.use('/api/arts', arts);
app.use('/api/artists', artists);

app.get('*', (req, res) => {
    res.render('404');
});

app.listen(process.env.PORT, () => {
    if (process.env.NODE_ENV === 'dev') console.log('App listening on PORT:' + process.env.PORT);
});

module.exports = { app: app, Art: Art.Art, Artist: Artist.Artist };