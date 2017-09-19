const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local');
const keys = require('../config/keys');
const mongoose = require('mongoose');
var _ = require('lodash');

const User = mongoose.model('users');
passport.serializeUser((user, done) => { //cookie
    done(null, user.id); //eri id kuin profile.id, kaytetaan kokska voi olla eri kirjautumisvaihtoehtoja
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        });
});

// GOOGLE AUTH
passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: "/auth/google/callback"
    }, (accessToken, refreshToken, profile, done) => {
        console.log("access TOKENI: ", accessToken);
        console.log('refresh token: ', refreshToken);
        console.log('profile: ', profile);
        console.log('PROFIILI SAHKOPOSTI: ', profile);
        let test = profile.emails;
        let te = _.map(test, 'value');
        let email = te.toString();
        console.log(email);

        User.findOne({ googleId: profile.id } || { email: email })
            .then((existingUser) => {
                if (existingUser) {
                    //kayttaja loytyi ID:lla 
                    console.log("kayttaja loydetty");
                    done(null, existingUser)
                } else {
                    //ei loytynyt talla ID:lla, luodaan uusi
                    new User({ googleId: profile.id, email: email })
                        .save()
                        .then(user => done(null, user)); //tallennettu kayttaja
                    //useria kaytetaan serializeUser kohdassa
                }
            });
    })
);
//GOOGLE AUTH LOPPUU

//FaceBook AUTH
passport.use(new FacebookStrategy({
    clientID: keys.facebookAppID,
    clientSecret: keys.facebookSecter,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['email', 'id', 'displayName', 'photos'],
    enableProof: true
},
    function (accessToken, refreshToken, profile, profileFields, done) {
        console.log("access TOKENI: ", accessToken);
        console.log('refresh token: ', refreshToken);
        console.log('PROFILE: ', profile);
        console.log('PROFILEFIELDS: ', profileFields);
        console.log("JSON TESTI:", profileFields._json.email);
        console.log("USER ON TASSA: ",User)
        let email = profileFields._json.email;
        //  console.log('PROFILEFIELDS: ', profileFields);

        User.findOne({ facebookId: profileFields.id } || { email: email })
            .then((existingUser) => {
                if (existingUser) {
                    //kayttaja loytyi ID:lla 
                    console.log("kayttaja loytyi")
                    done(null, existingUser)
                } else {
                    //ei loytynyt talla ID:lla, luodaan uusi
                    new User({ facebookId: profileFields.id, email: email })
                        .save()
                        .then(user => done(null, user)); //tallennettu kayttaja
                    //useria kaytetaan serializeUser kohdassa
                }
            });

        /*
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            return cb(err, user);
        });
        */
    }
));

// KAYTTAJA JA SALASANA

const localOptions = { usernameField: 'email' }; //koska tunnistus sahkopostilla, ei userNamella
passport.use(new LocalStrategy(localOptions, function (email, password, done) {
    //Verify this email and pasword, call done witht the user
    //if it is the correct email and password, otherwise call done with false
    User.findOne({ email: email.toLowerCase() }, function (err, user) { //email on user.js scheman email. Tietokannasta etsitaan
        if (err) { return done(err); }
        if (!user) { return done(null, false); }

        //compare passwords, is 'password' equal to user.password (tallennettu salasana)
        user.comparePassword(password, function (err, isMatch) { //verrataan tulee ja tallennettua salasanaa
            if (err) { return done(err); }
            if (!isMatch) { return done(null, false); }

            return done(null, user);
        });
    });
}));
