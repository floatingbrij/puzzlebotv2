const mongoose = require('mongoose');

const profilesch1 = new mongoose.Schema({
    lvlq: {type: String, require:true, unique: true},
    lvl: {type: Number,require:true,unique: true},
    lvlans: {type: String,require:true, unique: true}

})

const model = mongoose.model('goldrushdb', profilesch1);
module.exports = model;
