const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const expressFileUpload = require('express-fileupload');
const path = require('path');

require('dotenv').config()
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


app.use(session({
  secret: 'guvenli',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// MİDDLEWARE
app.use(express.static(path.join(__dirname, 'static')))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(expressFileUpload());



const users = require('./routes/users');
app.use('/user/', users)
const routes = require('./routes/routes');
app.use('/', routes)


const url = process.env.DB_HOST || 'mongodb://localhost/my_database';
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

 
app.listen(3000);