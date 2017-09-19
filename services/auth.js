const mongoose = require('mongoose');
const User = mongoose.model('users');
exports.signup = function (req, res, next) {
    //  res.send({ success: 'true' });
    console.log(req.body); //tieto mita syotetaan sisaan (front end puolelta)
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(422).send({ error: ' You must provide email and password' });
    }

    //see if a user with the given email exists
    User.findOne({ emaily: email }, function (err, existingUser) {
        if (err) { return next(err); }

        //If a user with email does exitsts,r eturn an error
        if (existingUser) {
            return res.status(422).send({ error: 'Email is in use' });
        }
        // If a user with email does NOT exist, create and save user record
        const user = new User({ // Pitaa vastaa tehtya Schemaa
            emaily: email,
            password: password
        });
        user.save();

    });
}