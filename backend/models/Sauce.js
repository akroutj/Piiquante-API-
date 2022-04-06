
const mongoose = require('mongoose');

const sauceShema = mongoose.Schema({
    name: { type: String, require: true },
    manufactured: { type: String, require: true },
    description: { type: String, require: true },
    mainPepper: { type: String, require: true },
    imageUrl: { type: String, require: true },
    heat: { type: Number, require: true },
});

module.exports = mongoose.model('Sauce', sauceShema);
