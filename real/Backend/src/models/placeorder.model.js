const mongoose = require("mongoose");

const placeOrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner",
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: { // locked price at order time
            type: Number,
            required: true,
            min: 0
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("PlaceOrder", placeOrderSchema);
