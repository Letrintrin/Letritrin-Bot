const { model, Schema } = require('mongoose');
const jointocreatechannel = new Schema({
    Guild: String,
    User: String,
    Channel: String,
})
module.exports = model('jointocreatechannel', jointocreatechannel);
