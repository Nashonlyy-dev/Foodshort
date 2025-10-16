const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    video: {
        type: String,
        required: true
    },
    description: {
        type: String,

    },
    price: {
        type: Number,
        required: true
    },
    foodpartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodPartner',
        required: true
    }
}, { timestamps: true });

const FoodModel = mongoose.model('Food', foodSchema);

module.exports = FoodModel;