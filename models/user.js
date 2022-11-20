const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
<<<<<<< HEAD
<<<<<<< HEAD
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
=======
>>>>>>> parent of 0a3eba7 (Mongoose Population)
=======
>>>>>>> parent of 0a3eba7 (Mongoose Population)
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);