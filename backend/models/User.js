
const mongoose = require('mongoose');
// const { TRUE } = require('node-sass');
const uniqueValidator = require('mongoose-unique-validator');

const userShema = mongoose.Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true }
});

// Application du plugin sur le userShema
userShema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userShema);