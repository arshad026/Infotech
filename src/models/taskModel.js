const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const taskSchema = new mongoose.Schema({

    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Priority: {
        type: String,
        required: true,
    },
    Status: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: 'user'
    }

}, { timestamps: true })


module.exports = mongoose.model('task', taskSchema)