if (process.env.NODE_ENV === 'dev' process.env.NODE_ENV === 'test') require('dotenv').config();
const path = require('path');

const express = require('express'),
    app = express();

// Template and engine integration.
app.engine('pug', require('pug').__express);
app.set('view engine', 'pug');
app.set('views', './src/views');

// public folder to serve.
app.use(express.static(path.join(__dirname, 'src/public')));


const consign = require('consign');

consign({ cwd: 'src' })
    .include('configs')
    .then('utils')
    .then('models')
    .then('middlewares')
    .then('routers')
    .into(app);

app.listen(process.env.PORT, () => {
    if (process.env.NODE_ENV === 'dev') console.log('App listening on PORT:' + process.env.PORT);
});

module.exports = app;