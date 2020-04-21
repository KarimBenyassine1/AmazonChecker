const mongoose = require('mongoose');


const InfoSchema = mongoose.Schema({
    user: {
    type: String,
    required: true
    },
    url: {
        type: String,
        required: true
    },
    minPrice: {
        type: String,
        required: true
    },
})


module.exports = mongoose.model('Info', InfoSchema);