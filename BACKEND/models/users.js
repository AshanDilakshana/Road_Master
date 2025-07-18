const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type :String, required: true},
    email: {type: String, required: true,},
    password: {type: String, required: true},
    province: {type: String, required: true},
    status: {type: String, default: 'active'},
        
});


module.exports = mongoose.model('User', userSchema);