const mongoose = require('mongoose');

const profilesch = new mongoose.Schema({
    userid: {type: String, require:true, unique: true},
    level: {type: Number, default: 0}

})

const model = mongoose.model('lvldb', profilesch);
module.exports = model;
