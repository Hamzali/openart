require('dotenv').config();

const app = require('express')();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

// database connection.
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGODB);
mongoose.connection.on('error', (err) => {
  console.log('MongoDB Connection Error: ' + err);
  process.exit(1);
});


// Template and engine integration.
app.engine('pug', require('pug').__express);
app.set('view engine', 'pug');
app.set('views', './views');


// middlewares
app.use(bodyparser.json());

app.use(morgan('dev'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// App routes.
app.get('/', (req, res) => {
    res.render('index');
});

app.get('*', (req, res) => {
    res.render('404');
});




app.listen(process.env.PORT, () => {
    console.log('App listening on PORT:' + process.env.PORT);
});