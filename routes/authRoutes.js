const passport = require('passport');
const Authentication = require('../services/auth');
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = (app) => {

    // GOOGLE AUTH !!!
    app.get('/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    );
    app.get('/auth/google/callback', passport.authenticate('google'));

    // FACEBOOK AUTH !!!
    //localhost:5000/auth/facebook
    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            scope: ['email']
        })
    );

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });

    // KAYTTAJA JA SALASANA
    app.get('/auth/local',
        passport.authenticate('local'),
        function (req, res) {
            res.send({ message: 'Super secret code is ABS1123123' });
        });

    //app.post('/auth/signup', Authentication.signup);
    app.post('/auth/signup', Authentication.signup);

    // MUUTA
    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.send(req.user);
    });


}
