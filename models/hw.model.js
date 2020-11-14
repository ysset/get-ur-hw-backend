const mongoose = require('mongoose')

const schema = mongoose.Schema({
    lessonName: String,
    themeName: String,
    type: String,
    createDate: Date,
    completeDate: String,
    hwStatus: String,
    hwPAth:String,
    users: [
        {
            username: String,
            hwPath: String,
            status: String,
            completeDate: String,
            uploadDate: Date
        }
    ],
    ban: Boolean,

},{collection: 'Home_works'});

module.exports = mongoose.model('hwModel', schema)