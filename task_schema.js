const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
   dueDate: String,
})

module.exports = mongoose.model('task', taskSchema)