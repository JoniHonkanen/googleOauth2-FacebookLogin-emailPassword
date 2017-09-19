const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const {Schema} = mongoose;

const userSchema = new Schema({
    googleId: String,
    facebookId: String,
    email: String,
    password: String,
    emaily: String
});
 
mongoose.model('users', userSchema);
