const mongoose  = require('mongoose')

const jointocreate = new mongoose.Schema({
    Guild: String,
    Channel: String,
    Category: String,
    VoiceLimit: Number
});

module.exports = mongoose.model('jointocreate', jointocreate);