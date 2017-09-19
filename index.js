const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express('');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');

require('./models/User'); //Tama ennen services/passporttia, muuten error
require('./services/passport');
require('./services/auth');

const authRoutes = require('./routes/authRoutes');

mongoose.connect(keys.mongoURI);
app.use(bodyParser.json({ type: '*/*' }));

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000, //30 paivaa 
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize()); //kertoo passportille cookien kaytosta
app.use(passport.session()); //kertoo passportille cookien kaytosta


authRoutes(app);
const PORT = process.env.PORT || 5000;
var server = app.listen(PORT, function () {
    console.log('Listening on port %d', server.address().port);
});
