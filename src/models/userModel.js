const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    }

}, { timestamps: true })


module.exports = mongoose.model('user', userSchema)